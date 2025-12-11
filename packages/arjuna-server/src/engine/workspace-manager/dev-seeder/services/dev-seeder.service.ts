import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';

import { isDefined } from 'arjuna-shared/utils';
import { DataSource } from 'typeorm';

import { ApplicationService } from 'src/engine/core-modules/application/application.service';
import { FeatureFlagKey } from 'src/engine/core-modules/feature-flag/enums/feature-flag-key.enum';
import { FeatureFlagService } from 'src/engine/core-modules/feature-flag/services/feature-flag.service';
import { ArjunaCRMConfigService } from 'src/engine/core-modules/arjuna-config/arjuna-config.service';
import { DataSourceService } from 'src/engine/metadata-modules/data-source/data-source.service';
import { ObjectMetadataEntity } from 'src/engine/metadata-modules/object-metadata/object-metadata.entity';
import { WorkspaceCacheStorageService } from 'src/engine/workspace-cache-storage/workspace-cache-storage.service';
import { WorkspaceCacheService } from 'src/engine/workspace-cache/services/workspace-cache.service';
import { WorkspaceDataSourceService } from 'src/engine/workspace-datasource/workspace-datasource.service';
import { SeededWorkspacesIds } from 'src/engine/workspace-manager/dev-seeder/core/constants/seeder-workspaces.constant';
import { DevSeederPermissionsService } from 'src/engine/workspace-manager/dev-seeder/core/services/dev-seeder-permissions.service';
import { seedCoreSchema } from 'src/engine/workspace-manager/dev-seeder/core/utils/seed-core-schema.util';
import { seedPageLayoutTabs } from 'src/engine/workspace-manager/dev-seeder/core/utils/seed-page-layout-tabs.util';
import { seedPageLayoutWidgets } from 'src/engine/workspace-manager/dev-seeder/core/utils/seed-page-layout-widgets.util';
import { seedPageLayouts } from 'src/engine/workspace-manager/dev-seeder/core/utils/seed-page-layouts.util';
import { DevSeederDataService } from 'src/engine/workspace-manager/dev-seeder/data/services/dev-seeder-data.service';
import { DevSeederMetadataService } from 'src/engine/workspace-manager/dev-seeder/metadata/services/dev-seeder-metadata.service';
import { ARJUNA_STANDARD_APPLICATION } from 'src/engine/workspace-manager/arjuna-standard-application/constants/arjuna-standard-applications';
import { WorkspaceSyncMetadataService } from 'src/engine/workspace-manager/workspace-sync-metadata/workspace-sync-metadata.service';

@Injectable()
export class DevSeederService {
  constructor(
    private readonly workspaceCacheStorageService: WorkspaceCacheStorageService,
    private readonly arjunaConfigService: ArjunaCRMConfigService,
    private readonly workspaceDataSourceService: WorkspaceDataSourceService,
    private readonly dataSourceService: DataSourceService,
    private readonly featureFlagService: FeatureFlagService,
    private readonly workspaceSyncMetadataService: WorkspaceSyncMetadataService,
    private readonly devSeederMetadataService: DevSeederMetadataService,
    private readonly devSeederPermissionsService: DevSeederPermissionsService,
    private readonly devSeederDataService: DevSeederDataService,
    private readonly applicationService: ApplicationService,
    private readonly workspaceCacheService: WorkspaceCacheService,
    @InjectDataSource()
    private readonly coreDataSource: DataSource,
  ) {}

  public async seedDev(workspaceId: SeededWorkspacesIds): Promise<void> {
    const isBillingEnabled = this.arjunaConfigService.get('IS_BILLING_ENABLED');
    const appVersion = this.arjunaConfigService.get('APP_VERSION');

    await seedCoreSchema({
      dataSource: this.coreDataSource,
      workspaceId,
      applicationService: this.applicationService,
      seedBilling: isBillingEnabled,
      appVersion,
    });

    const schemaName =
      await this.workspaceDataSourceService.createWorkspaceDBSchema(
        workspaceId,
      );

    const { featureFlagsMap } = await this.workspaceCacheService.getOrRecompute(
      workspaceId,
      ['flatApplicationMaps', 'featureFlagsMap'],
    );

    const dataSourceMetadata =
      await this.dataSourceService.createDataSourceMetadata(
        workspaceId,
        schemaName,
      );

    const arjunaStandardApplication =
      await this.applicationService.findByUniversalIdentifier({
        workspaceId,
        universalIdentifier: ARJUNA_STANDARD_APPLICATION.universalIdentifier,
      });

    if (!isDefined(arjunaStandardApplication)) {
      throw new Error(
        'Seeder failed to find arjuna standard application, should never occur',
      );
    }

    const { arjunaStandardFlatApplication, workspaceCustomFlatApplication } =
      await this.applicationService.findWorkspaceArjunaCRMStandardAndCustomApplicationOrThrow(
        {
          workspaceId,
        },
      );

    await this.workspaceSyncMetadataService.synchronize({
      workspaceId: workspaceId,
      dataSourceId: dataSourceMetadata.id,
      featureFlags: featureFlagsMap,
    });

    await this.devSeederMetadataService.seed({
      dataSourceMetadata,
      workspaceId,
      featureFlags: featureFlagsMap,
      arjunaStandardFlatApplication,
    });

    await this.devSeederMetadataService.seedRelations({
      workspaceId,
    });

    await this.devSeederPermissionsService.initPermissions({
      workspaceId,
      arjunaStandardApplication,
    });

    await seedPageLayouts(
      this.coreDataSource,
      'core',
      workspaceId,
      workspaceCustomFlatApplication.id,
    );
    await seedPageLayoutTabs({
      applicationId: workspaceCustomFlatApplication.id,
      workspaceId,
      dataSource: this.coreDataSource,
      schemaName: 'core',
    });

    const objectMetadataRepository =
      this.coreDataSource.getRepository(ObjectMetadataEntity);
    const objectMetadataItems = await objectMetadataRepository.find({
      where: { workspaceId },
      relations: { fields: true },
    });

    const isDashboardV2Enabled =
      featureFlagsMap[FeatureFlagKey.IS_DASHBOARD_V2_ENABLED] ?? false;

    await seedPageLayoutWidgets({
      dataSource: this.coreDataSource,
      schemaName: 'core',
      workspaceId,
      objectMetadataItems,
      isDashboardV2Enabled,
      workspaceCustomApplicationId: workspaceCustomFlatApplication.id,
    });

    await this.devSeederDataService.seed({
      schemaName: dataSourceMetadata.schema,
      workspaceId,
      featureFlags: featureFlagsMap,
    });

    await this.workspaceCacheStorageService.flush(workspaceId, undefined);
  }
}
