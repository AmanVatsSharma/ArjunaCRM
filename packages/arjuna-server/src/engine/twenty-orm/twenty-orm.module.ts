import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FeatureFlagModule } from 'src/engine/core-modules/feature-flag/feature-flag.module';
import { ArjunaCRMConfigModule } from 'src/engine/core-modules/arjuna-config/arjuna-config.module';
import { WorkspaceEntity } from 'src/engine/core-modules/workspace/workspace.entity';
import { DataSourceModule } from 'src/engine/metadata-modules/data-source/data-source.module';
import { WorkspaceManyOrAllFlatEntityMapsCacheModule } from 'src/engine/metadata-modules/flat-entity/services/workspace-many-or-all-flat-entity-maps-cache.module';
import { ObjectMetadataEntity } from 'src/engine/metadata-modules/object-metadata/object-metadata.entity';
import { PermissionsModule } from 'src/engine/metadata-modules/permissions/permissions.module';
import { RoleTargetEntity } from 'src/engine/metadata-modules/role-target/role-target.entity';
import { WorkspaceFeatureFlagsMapCacheModule } from 'src/engine/metadata-modules/workspace-feature-flags-map-cache/workspace-feature-flags-map-cache.module';
import { entitySchemaFactories } from 'src/engine/arjuna-orm/factories';
import { EntitySchemaFactory } from 'src/engine/arjuna-orm/factories/entity-schema.factory';
import { ArjunaCRMORMGlobalManager } from 'src/engine/arjuna-orm/arjuna-orm-global.manager';
import { WorkspaceCacheStorageModule } from 'src/engine/workspace-cache-storage/workspace-cache-storage.module';
import { WorkspaceCacheModule } from 'src/engine/workspace-cache/workspace-cache.module';

import { PgPoolSharedModule } from './pg-shared-pool/pg-shared-pool.module';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([
      ObjectMetadataEntity,
      RoleTargetEntity,
      WorkspaceEntity,
    ]),
    DataSourceModule,
    WorkspaceCacheStorageModule,
    WorkspaceManyOrAllFlatEntityMapsCacheModule,
    PermissionsModule,
    WorkspaceFeatureFlagsMapCacheModule,
    FeatureFlagModule,
    ArjunaCRMConfigModule,
    PgPoolSharedModule,
    WorkspaceCacheModule,
  ],
  providers: [...entitySchemaFactories, ArjunaCRMORMGlobalManager],
  exports: [EntitySchemaFactory, ArjunaCRMORMGlobalManager, PgPoolSharedModule],
})
export class ArjunaCRMORMModule {}
