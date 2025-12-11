import {
  Injectable,
  Logger,
  OnApplicationShutdown,
  OnModuleInit,
} from '@nestjs/common';

import { ArjunaCRMConfigService } from 'src/engine/core-modules/arjuna-config/arjuna-config.service';
import { GlobalWorkspaceDataSource } from 'src/engine/arjuna-orm/global-workspace-datasource/global-workspace-datasource';
import { WorkspaceEventEmitter } from 'src/engine/workspace-event-emitter/workspace-event-emitter';

@Injectable()
export class GlobalWorkspaceDataSourceService
  implements OnModuleInit, OnApplicationShutdown
{
  private readonly logger = new Logger(GlobalWorkspaceDataSourceService.name);
  private globalWorkspaceDataSource: GlobalWorkspaceDataSource | null = null;

  constructor(
    private readonly arjunaConfigService: ArjunaCRMConfigService,
    private readonly workspaceEventEmitter: WorkspaceEventEmitter,
  ) {}

  async onModuleInit(): Promise<void> {
    this.globalWorkspaceDataSource = new GlobalWorkspaceDataSource(
      {
        url: this.arjunaConfigService.get('PG_DATABASE_URL'),
        type: 'postgres',
        logging: this.arjunaConfigService.getLoggingConfig(),
        entities: [],
        ssl: this.arjunaConfigService.get('PG_SSL_ALLOW_SELF_SIGNED')
          ? {
              rejectUnauthorized: false,
            }
          : undefined,
        extra: {
          query_timeout: 10000, // 10 seconds,
          idleTimeoutMillis: 120_000, // 2 minutes,
          max: 4,
          allowExitOnIdle: true,
        },
      },
      this.workspaceEventEmitter,
    );

    await this.globalWorkspaceDataSource.initialize();
  }

  public getGlobalWorkspaceDataSource(): GlobalWorkspaceDataSource {
    if (!this.globalWorkspaceDataSource) {
      throw new Error(
        'GlobalWorkspaceDataSource has not been initialized. Make sure the module has been initialized.',
      );
    }

    return this.globalWorkspaceDataSource;
  }

  async onApplicationShutdown(): Promise<void> {
    if (this.globalWorkspaceDataSource) {
      await this.globalWorkspaceDataSource.destroy();
      this.globalWorkspaceDataSource = null;
    }
  }
}
