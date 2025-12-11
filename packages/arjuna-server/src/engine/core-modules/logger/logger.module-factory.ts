import {
  LoggerDriverType,
  type LoggerModuleOptions,
} from 'src/engine/core-modules/logger/interfaces';
import { type ArjunaCRMConfigService } from 'src/engine/core-modules/arjuna-config/arjuna-config.service';

/**
 * Logger Module factory
 * @returns LoggerModuleOptions
 * @param arjunaConfigService
 */
export const loggerModuleFactory = async (
  arjunaConfigService: ArjunaCRMConfigService,
): Promise<LoggerModuleOptions> => {
  const driverType = arjunaConfigService.get('LOGGER_DRIVER');
  const logLevels = arjunaConfigService.get('LOG_LEVELS');

  switch (driverType) {
    case LoggerDriverType.CONSOLE: {
      return {
        type: LoggerDriverType.CONSOLE,
        logLevels: logLevels,
      };
    }
    default:
      throw new Error(
        `Invalid logger driver type (${driverType}), check your .env file`,
      );
  }
};
