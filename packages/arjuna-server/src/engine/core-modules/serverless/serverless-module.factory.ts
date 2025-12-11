import { fromNodeProviderChain } from '@aws-sdk/credential-providers';

import { type FileStorageService } from 'src/engine/core-modules/file-storage/file-storage.service';
import {
  ServerlessDriverType,
  type ServerlessModuleOptions,
} from 'src/engine/core-modules/serverless/serverless.interface';
import { type ArjunaCRMConfigService } from 'src/engine/core-modules/arjuna-config/arjuna-config.service';

export const serverlessModuleFactory = async (
  arjunaConfigService: ArjunaCRMConfigService,
  fileStorageService: FileStorageService,
): Promise<ServerlessModuleOptions> => {
  const driverType = arjunaConfigService.get('SERVERLESS_TYPE');
  const options = { fileStorageService };

  switch (driverType) {
    case ServerlessDriverType.LOCAL: {
      return {
        type: ServerlessDriverType.LOCAL,
        options,
      };
    }
    case ServerlessDriverType.LAMBDA: {
      const region = arjunaConfigService.get('SERVERLESS_LAMBDA_REGION');
      const accessKeyId = arjunaConfigService.get(
        'SERVERLESS_LAMBDA_ACCESS_KEY_ID',
      );
      const secretAccessKey = arjunaConfigService.get(
        'SERVERLESS_LAMBDA_SECRET_ACCESS_KEY',
      );
      const lambdaRole = arjunaConfigService.get('SERVERLESS_LAMBDA_ROLE');

      const subhostingRole = arjunaConfigService.get(
        'SERVERLESS_LAMBDA_SUBHOSTING_ROLE',
      );

      return {
        type: ServerlessDriverType.LAMBDA,
        options: {
          ...options,
          credentials: accessKeyId
            ? {
                accessKeyId,
                secretAccessKey,
              }
            : fromNodeProviderChain({
                clientConfig: { region },
              }),
          region,
          lambdaRole,
          subhostingRole,
        },
      };
    }
    default:
      throw new Error(
        `Invalid serverless driver type (${driverType}), check your .env file`,
      );
  }
};
