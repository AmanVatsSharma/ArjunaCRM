import { InjectRepository } from '@nestjs/typeorm';

import { Command } from 'nest-commander';
import { In, Repository } from 'typeorm';

import { ActiveOrSuspendedWorkspacesMigrationCommandRunner } from 'src/database/commands/command-runners/active-or-suspended-workspaces-migration.command-runner';
import { RunOnWorkspaceArgs } from 'src/database/commands/command-runners/workspaces-migration.command-runner';
import { ApplicationEntity } from 'src/engine/core-modules/application/application.entity';
import { ApplicationService } from 'src/engine/core-modules/application/application.service';
import { WorkspaceEntity } from 'src/engine/core-modules/workspace/workspace.entity';
import { DataSourceService } from 'src/engine/metadata-modules/data-source/data-source.service';
import { GlobalWorkspaceOrmManager } from 'src/engine/arjuna-orm/global-workspace-datasource/global-workspace-orm.manager';
import { ARJUNA_STANDARD_APPLICATION } from 'src/engine/workspace-manager/arjuna-standard-application/constants/arjuna-standard-applications';

@Command({
  name: 'upgrade:1-11:create-arjuna-standard-application',
  description:
    'Create arjuna-standard application for workspaces that do not have them',
})
export class CreateArjunaCRMStandardApplicationCommand extends ActiveOrSuspendedWorkspacesMigrationCommandRunner {
  constructor(
    @InjectRepository(WorkspaceEntity)
    protected readonly workspaceRepository: Repository<WorkspaceEntity>,
    protected readonly arjunaORMGlobalManager: GlobalWorkspaceOrmManager,
    protected readonly dataSourceService: DataSourceService,
    @InjectRepository(ApplicationEntity)
    private readonly applicationRepository: Repository<ApplicationEntity>,
    private readonly applicationService: ApplicationService,
  ) {
    super(workspaceRepository, arjunaORMGlobalManager, dataSourceService);
  }

  override async runOnWorkspace({
    workspaceId,
    options,
  }: RunOnWorkspaceArgs): Promise<void> {
    this.logger.log(
      `Checking standard applications for workspace ${workspaceId}`,
    );

    const existingApplications = await this.applicationRepository.find({
      where: {
        workspaceId,
        universalIdentifier: In([
          ARJUNA_STANDARD_APPLICATION.universalIdentifier,
        ]),
      },
    });

    const existingIds = new Set(
      existingApplications.map((app) => app.universalIdentifier),
    );

    if (existingIds.has(ARJUNA_STANDARD_APPLICATION.universalIdentifier)) {
      this.logger.log(
        `Skipping arjuna standard application as it already exists`,
      );

      return;
    }

    this.logger.log(`About to seed arjuna standard application`);
    if (options.dryRun) {
      return;
    }

    try {
      await this.applicationService.createArjunaCRMStandardApplication({
        workspaceId,
      });

      this.logger.log(`Successfully seeded arjuna standard`);
    } catch (e) {
      this.logger.error(`Failed to seed arjuna standard`, e);
    }
  }
}
