import { Module } from '@nestjs/common';

import { ArjunaCRMORMModule } from 'src/engine/arjuna-orm/arjuna-orm.module';

import { RecordPositionService } from './services/record-position.service';

@Module({
  imports: [ArjunaCRMORMModule],
  providers: [RecordPositionService],
  exports: [RecordPositionService],
})
export class RecordPositionModule {}
