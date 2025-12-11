import { type DynamicModule, Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';

import { KeyValuePairEntity } from 'src/engine/core-modules/key-value-pair/key-value-pair.entity';
import { ConfigCacheService } from 'src/engine/core-modules/arjuna-config/cache/config-cache.service';
import { ConfigVariables } from 'src/engine/core-modules/arjuna-config/config-variables';
import { CONFIG_VARIABLES_INSTANCE_TOKEN } from 'src/engine/core-modules/arjuna-config/constants/config-variables-instance-tokens.constants';
import { ConfigValueConverterService } from 'src/engine/core-modules/arjuna-config/conversion/config-value-converter.service';
import { DatabaseConfigDriver } from 'src/engine/core-modules/arjuna-config/drivers/database-config.driver';
import { EnvironmentConfigDriver } from 'src/engine/core-modules/arjuna-config/drivers/environment-config.driver';
import { ConfigStorageService } from 'src/engine/core-modules/arjuna-config/storage/config-storage.service';

@Module({})
export class DatabaseConfigModule {
  static forRoot(): DynamicModule {
    return {
      module: DatabaseConfigModule,
      imports: [
        TypeOrmModule.forFeature([KeyValuePairEntity]),
        ScheduleModule.forRoot(),
      ],
      providers: [
        DatabaseConfigDriver,
        ConfigCacheService,
        ConfigStorageService,
        ConfigValueConverterService,
        EnvironmentConfigDriver,
        {
          provide: CONFIG_VARIABLES_INSTANCE_TOKEN,
          useValue: new ConfigVariables(),
        },
      ],
      exports: [DatabaseConfigDriver],
    };
  }
}
