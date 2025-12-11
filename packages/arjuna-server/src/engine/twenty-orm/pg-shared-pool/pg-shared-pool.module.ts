import {
  Global,
  Logger,
  Module,
  type OnApplicationShutdown,
  type OnModuleInit,
} from '@nestjs/common';

import { ArjunaCRMConfigModule } from 'src/engine/core-modules/arjuna-config/arjuna-config.module';
import { PgPoolSharedService } from 'src/engine/arjuna-orm/pg-shared-pool/pg-shared-pool.service';

/**
 * Module that initializes the shared pg pool at application bootstrap
 */
@Global()
@Module({
  imports: [ArjunaCRMConfigModule],
  providers: [PgPoolSharedService],
  exports: [PgPoolSharedService],
})
export class PgPoolSharedModule implements OnModuleInit, OnApplicationShutdown {
  constructor(private readonly pgPoolSharedService: PgPoolSharedService) {}
  private readonly logger = new Logger(PgPoolSharedModule.name);

  /**
   * Initialize the pool sharing service when the module is initialized
   */
  async onModuleInit() {
    await this.pgPoolSharedService.initialize();
  }

  /**
   * Clean up any resources when the application shuts down
   */
  async onApplicationShutdown() {
    this.logger.log('Shutting down PgPoolSharedModule');
    await this.pgPoolSharedService.onApplicationShutdown();
  }
}
