import { Module } from '@nestjs/common';

import { ObjectMetadataRepositoryModule } from 'src/engine/object-metadata-repository/object-metadata-repository.module';
import { ArjunaCRMORMModule } from 'src/engine/arjuna-orm/arjuna-orm.module';
import { BlocklistValidationService } from 'src/modules/blocklist/blocklist-validation-manager/services/blocklist-validation.service';
import { BlocklistWorkspaceEntity } from 'src/modules/blocklist/standard-objects/blocklist.workspace-entity';

@Module({
  imports: [
    ObjectMetadataRepositoryModule.forFeature([BlocklistWorkspaceEntity]),
    ArjunaCRMORMModule,
  ],
  providers: [BlocklistValidationService],
  exports: [BlocklistValidationService],
})
export class BlocklistValidationManagerModule {}
