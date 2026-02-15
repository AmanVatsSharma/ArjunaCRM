import { createHash } from 'crypto';

import { Logger } from '@nestjs/common';
import RedisStore from 'connect-redis';
import { createClient } from 'redis';

import type session from 'express-session';

import { CacheStorageType } from 'src/engine/core-modules/cache-storage/types/cache-storage-type.enum';
import { type ArjunaCRMConfigService } from 'src/engine/core-modules/arjuna-config/arjuna-config.service';

const logger = new Logger('SessionStorageFactory');

export const getSessionStorageOptions = (
  arjunaConfigService: ArjunaCRMConfigService,
): Promise<session.SessionOptions> =>
  buildSessionStorageOptions(arjunaConfigService);

const buildSessionStorageOptions = async (
  arjunaConfigService: ArjunaCRMConfigService,
): Promise<session.SessionOptions> => {
  const cacheStorageType = CacheStorageType.Redis;

  const SERVER_URL = arjunaConfigService.get('SERVER_URL');

  const appSecret = arjunaConfigService.get('APP_SECRET');

  if (!appSecret) {
    throw new Error('APP_SECRET is not set');
  }

  const sessionSecret = createHash('sha256')
    .update(`${appSecret}SESSION_STORE_SECRET`)
    .digest('hex');

  const sessionStorageOptions: session.SessionOptions = {
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    proxy: true,
    cookie: {
      secure: !!(SERVER_URL && SERVER_URL.startsWith('https')),
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 1000 * 60 * 30, // 30 minutes
    },
  };

  switch (cacheStorageType) {
    /* case CacheStorageType.Memory: {
      Logger.warn(
        'Memory session storage is not recommended for production. Prefer Redis.',
      );

      return sessionStorage;
    }*/
    case CacheStorageType.Redis: {
      const connectionString = arjunaConfigService.get('REDIS_URL');

      if (!connectionString) {
        throw new Error(
          `${CacheStorageType.Redis} session storage requires REDIS_URL to be defined, check your .env file`,
        );
      }

      const redisClient = createClient({
        url: connectionString,
      });

      redisClient.on('error', (error) => {
        logger.error('Redis session client error', error?.stack);
      });

      logger.log('Connecting Redis session store client');
      await redisClient.connect();
      logger.log('Redis session store client connected');

      return {
        ...sessionStorageOptions,
        store: new RedisStore({
          client: redisClient,
          prefix: 'engine:session:',
        }),
      };
    }
    default:
      throw new Error(
        `Invalid session-storage (${cacheStorageType}), check your .env file`,
      );
  }
};
