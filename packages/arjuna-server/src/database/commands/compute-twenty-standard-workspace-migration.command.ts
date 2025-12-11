import { Logger } from '@nestjs/common';

import { writeFileSync } from 'fs';

import { Command, CommandRunner } from 'nest-commander';
import { WorkspaceMigrationV2ExceptionCode } from 'arjuna-shared/metadata';

import { createEmptyFlatEntityMaps } from 'src/engine/metadata-modules/flat-entity/constant/create-empty-flat-entity-maps.constant';
import { computeArjunaCRMStandardApplicationAllFlatEntityMaps } from 'src/engine/workspace-manager/arjuna-standard-application/utils/arjuna-standard-application-all-flat-entity-maps.constant';
import { WorkspaceMigrationBuildOrchestratorService } from 'src/engine/workspace-manager/workspace-migration-v2/services/workspace-migration-build-orchestrator.service';
import { WorkspaceMigrationV2Exception } from 'src/engine/workspace-manager/workspace-migration.exception';

@Command({
  name: 'workspace:compute-arjuna-standard-migration',
  description: 'Compute ArjunaCRM standard workspace migration.',
})
export class ComputeArjunaCRMStandardWorkspaceMigrationCommand extends CommandRunner {
  private readonly logger = new Logger(
    ComputeArjunaCRMStandardWorkspaceMigrationCommand.name,
  );

  constructor(
    private readonly workspaceMigrationBuildOrchestratorService: WorkspaceMigrationBuildOrchestratorService,
  ) {
    super();
  }

  async run(): Promise<void> {
    this.logger.log('Starting compute ArjunaCRM standard workspace migration...');

    // TODO: Implement migration logic here
    const workspaceId = '20202020-ef6f-4118-953c-2b027324b54a';
    const arjunaStandardApplicationId = '20202020-5adb-4091-81b7-d5be86a8bdd2';
    const arjunaStandardAllFlatEntityMaps =
      computeArjunaCRMStandardApplicationAllFlatEntityMaps({
        now: new Date().toISOString(),
        workspaceId,
        arjunaStandardApplicationId,
      });

    writeFileSync(
      `${Date.now()}-all-flat-entity-maps.json`,
      JSON.stringify(arjunaStandardAllFlatEntityMaps, null, 2),
    );

    const validateAndBuildResult =
      await this.workspaceMigrationBuildOrchestratorService
        .buildWorkspaceMigration({
          buildOptions: {
            isSystemBuild: true,
          },
          fromToAllFlatEntityMaps: {
            flatObjectMetadataMaps: {
              from: createEmptyFlatEntityMaps(),
              to: arjunaStandardAllFlatEntityMaps.flatObjectMetadataMaps,
            },
            flatFieldMetadataMaps: {
              from: createEmptyFlatEntityMaps(),
              to: arjunaStandardAllFlatEntityMaps.flatFieldMetadataMaps,
            },
            flatIndexMaps: {
              from: createEmptyFlatEntityMaps(),
              to: arjunaStandardAllFlatEntityMaps.flatIndexMaps,
            },
            flatViewFieldMaps: {
              from: createEmptyFlatEntityMaps(),
              to: arjunaStandardAllFlatEntityMaps.flatViewFieldMaps,
            },
            flatViewFilterMaps: {
              from: createEmptyFlatEntityMaps(),
              to: arjunaStandardAllFlatEntityMaps.flatViewFilterMaps,
            },
            flatViewGroupMaps: {
              from: createEmptyFlatEntityMaps(),
              to: arjunaStandardAllFlatEntityMaps.flatViewGroupMaps,
            },
            flatViewMaps: {
              from: createEmptyFlatEntityMaps(),
              to: arjunaStandardAllFlatEntityMaps.flatViewMaps,
            },
          },
          workspaceId,
        })
        .catch((error) => {
          this.logger.error(error);
          throw new WorkspaceMigrationV2Exception(
            WorkspaceMigrationV2ExceptionCode.BUILDER_INTERNAL_SERVER_ERROR,
            error.message,
          );
        });

    writeFileSync(
      `${Date.now()}validate-and-build-result.json`,
      JSON.stringify(validateAndBuildResult, null, 2),
    );

    this.logger.log(
      'Compute ArjunaCRM standard workspace migration completed successfully.',
    );
  }
}
