import { NestFactory } from '@nestjs/core';
import { type NestExpressApplication } from '@nestjs/platform-express';

import fs from 'fs';

import bytes from 'bytes';
import { useContainer } from 'class-validator';
import { type NextFunction, type Request, type Response } from 'express';
import session from 'express-session';
import graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.mjs';

import { NodeEnvironment } from 'src/engine/core-modules/arjuna-config/interfaces/node-environment.interface';

import { setPgDateTypeParser } from 'src/database/pg/set-pg-date-type-parser';
import { LoggerService } from 'src/engine/core-modules/logger/logger.service';
import { getSessionStorageOptions } from 'src/engine/core-modules/session-storage/session-storage.module-factory';
import { ArjunaCRMConfigService } from 'src/engine/core-modules/arjuna-config/arjuna-config.service';
import { UnhandledExceptionFilter } from 'src/filters/unhandled-exception.filter';

import { AppModule } from './app.module';
import './instrument';

import { settings } from './engine/constants/settings';
import { generateFrontConfig } from './utils/generate-front-config';

const normalizeOrigin = (origin: string): string => {
  try {
    const parsedOrigin = new URL(origin);

    return `${parsedOrigin.protocol}//${parsedOrigin.host}`;
  } catch {
    return origin.replace(/\/+$/, '');
  }
};

const parseCorsOrigins = (configValue?: string): string[] => {
  if (!configValue) {
    return [];
  }

  return configValue
    .split(',')
    .map((origin) => origin.trim())
    .filter((origin) => origin.length > 0)
    .map(normalizeOrigin);
};

const buildCorsAllowList = (
  arjunaConfigService: ArjunaCRMConfigService,
): string[] => {
  const nodeEnvironment = arjunaConfigService.get('NODE_ENV');
  const configuredOrigins = parseCorsOrigins(
    arjunaConfigService.get('CORS_ALLOWED_ORIGINS'),
  );
  const knownOrigins = [
    arjunaConfigService.get('FRONTEND_URL'),
    arjunaConfigService.get('PUBLIC_DOMAIN_URL'),
    arjunaConfigService.get('SERVER_URL'),
  ]
    .filter((origin): origin is string => Boolean(origin))
    .map(normalizeOrigin);

  const localDevelopmentOrigins =
    nodeEnvironment === NodeEnvironment.DEVELOPMENT
      ? [
          'http://localhost:3000',
          'http://localhost:3001',
          'http://localhost:3003',
          'http://127.0.0.1:3000',
          'http://127.0.0.1:3001',
          'http://127.0.0.1:3003',
        ]
      : [];

  return Array.from(
    new Set([...knownOrigins, ...configuredOrigins, ...localDevelopmentOrigins]),
  );
};

const applySecurityHeaders = (
  app: NestExpressApplication,
  nodeEnvironment: NodeEnvironment,
  serverUrl?: string,
) => {
  app.use((_request: Request, response: Response, next: NextFunction) => {
    response.setHeader('X-Content-Type-Options', 'nosniff');
    response.setHeader('X-Frame-Options', 'DENY');
    response.setHeader(
      'Referrer-Policy',
      'strict-origin-when-cross-origin',
    );
    response.setHeader('X-DNS-Prefetch-Control', 'off');
    response.setHeader('X-Permitted-Cross-Domain-Policies', 'none');

    if (nodeEnvironment !== NodeEnvironment.DEVELOPMENT) {
      response.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
      response.setHeader('Cross-Origin-Resource-Policy', 'same-site');
    }

    if (serverUrl?.startsWith('https://')) {
      response.setHeader(
        'Strict-Transport-Security',
        'max-age=31536000; includeSubDomains',
      );
    }

    next();
  });
};

const bootstrap = async () => {
  setPgDateTypeParser();

  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: false,
    bufferLogs: process.env.LOGGER_IS_BUFFER_ENABLED === 'true',
    rawBody: true,
    snapshot: process.env.NODE_ENV === NodeEnvironment.DEVELOPMENT,
    ...(process.env.SSL_KEY_PATH && process.env.SSL_CERT_PATH
      ? {
          httpsOptions: {
            key: fs.readFileSync(process.env.SSL_KEY_PATH),
            cert: fs.readFileSync(process.env.SSL_CERT_PATH),
          },
        }
      : {}),
  });
  const logger = app.get(LoggerService);
  const arjunaConfigService = app.get(ArjunaCRMConfigService);
  const nodeEnvironment = arjunaConfigService.get('NODE_ENV');
  const serverUrl = arjunaConfigService.get('SERVER_URL');
  const corsAllowList = buildCorsAllowList(arjunaConfigService);

  if (serverUrl?.startsWith('https://')) {
    app.set('trust proxy', 1);
  }

  applySecurityHeaders(app, nodeEnvironment, serverUrl);

  logger.log(`Configured CORS allowlist with ${corsAllowList.length} origins`);

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin) {
        callback(null, true);

        return;
      }

      if (corsAllowList.includes(normalizeOrigin(origin))) {
        callback(null, true);

        return;
      }

      logger.warn(`Blocked CORS request from origin: ${origin}`);
      callback(new Error('Origin not allowed by CORS'), false);
    },
    credentials: true,
  });

  app.use(session(getSessionStorageOptions(arjunaConfigService)));

  // Apply class-validator container so that we can use injection in validators
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  // Use our logger
  app.useLogger(logger);

  app.useGlobalFilters(new UnhandledExceptionFilter());

  app.useBodyParser('json', { limit: settings.storage.maxFileSize });
  app.useBodyParser('urlencoded', {
    limit: settings.storage.maxFileSize,
    extended: true,
  });

  // Graphql file upload
  app.use(
    '/graphql',
    graphqlUploadExpress({
      maxFieldSize: bytes(settings.storage.maxFileSize),
      maxFiles: 10,
    }),
  );

  app.use(
    '/metadata',
    graphqlUploadExpress({
      maxFieldSize: bytes(settings.storage.maxFileSize),
      maxFiles: 10,
    }),
  );

  // Inject the server url in the frontend page
  generateFrontConfig();

  await app.listen(arjunaConfigService.get('NODE_PORT'));
};

bootstrap().catch((error) => {
  console.error('Failed to bootstrap ArjunaCRM server', error);
  process.exit(1);
});
