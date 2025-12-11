import { Module } from '@nestjs/common';

import { WorkspaceManyOrAllFlatEntityMapsCacheModule } from 'src/engine/metadata-modules/flat-entity/services/workspace-many-or-all-flat-entity-maps-cache.module';
import { ObjectMetadataRepositoryModule } from 'src/engine/object-metadata-repository/object-metadata-repository.module';
import { ArjunaCRMORMModule } from 'src/engine/arjuna-orm/arjuna-orm.module';
import { TimelineActivityService } from 'src/modules/timeline/services/timeline-activity.service';
import { TimelineActivityWorkspaceEntity } from 'src/modules/timeline/standard-objects/timeline-activity.workspace-entity';

@Module({
  imports: [
    ObjectMetadataRepositoryModule.forFeature([
      TimelineActivityWorkspaceEntity,
    ]),
    ArjunaCRMORMModule,
    WorkspaceManyOrAllFlatEntityMapsCacheModule,
  ],
  providers: [TimelineActivityService],
  exports: [TimelineActivityService],
})
export class TimelineActivityModule {}
