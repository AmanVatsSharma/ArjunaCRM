import { Module } from '@nestjs/common';

import { ArjunaCRMConfigModule } from 'src/engine/core-modules/arjuna-config/arjuna-config.module';

import { ClickHouseService } from './clickHouse.service';

@Module({
  imports: [ArjunaCRMConfigModule],
  providers: [ClickHouseService],
  exports: [ClickHouseService],
})
export class ClickHouseModule {}
