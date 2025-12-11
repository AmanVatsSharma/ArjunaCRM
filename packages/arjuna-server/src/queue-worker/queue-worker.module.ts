import { Module } from '@nestjs/common';

import { CoreEngineModule } from 'src/engine/core-modules/core-engine.module';
import { JobsModule } from 'src/engine/core-modules/message-queue/jobs.module';
import { MessageQueueModule } from 'src/engine/core-modules/message-queue/message-queue.module';
import { GlobalWorkspaceDataSourceModule } from 'src/engine/arjuna-orm/global-workspace-datasource/global-workspace-datasource.module';
import { ArjunaCRMORMModule } from 'src/engine/arjuna-orm/arjuna-orm.module';
import { WorkspaceEventEmitterModule } from 'src/engine/workspace-event-emitter/workspace-event-emitter.module';

@Module({
  imports: [
    CoreEngineModule,
    MessageQueueModule.registerExplorer(),
    WorkspaceEventEmitterModule,
    JobsModule,
    ArjunaCRMORMModule,
    GlobalWorkspaceDataSourceModule,
  ],
})
export class QueueWorkerModule {}
