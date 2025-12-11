import { Injectable } from '@nestjs/common';

import { PermissionFlagType } from 'arjuna-shared/constants';

import { ToolType } from 'src/engine/core-modules/tool/enums/tool-type.enum';
import { HttpTool } from 'src/engine/core-modules/tool/tools/http-tool/http-tool';
import { SendEmailTool } from 'src/engine/core-modules/tool/tools/send-email-tool/send-email-tool';
import { type SendEmailInput } from 'src/engine/core-modules/tool/tools/send-email-tool/types/send-email-input.type';
import { type Tool } from 'src/engine/core-modules/tool/types/tool.type';
import { ArjunaCRMConfigService } from 'src/engine/core-modules/arjuna-config/arjuna-config.service';

@Injectable()
export class ToolRegistryService {
  private readonly toolFactories: Map<ToolType, () => Tool>;

  constructor(
    private readonly sendEmailTool: SendEmailTool,
    private readonly arjunaConfigService: ArjunaCRMConfigService,
  ) {
    this.toolFactories = new Map<ToolType, () => Tool>([
      [
        ToolType.HTTP_REQUEST,
        () => {
          const httpTool = new HttpTool(arjunaConfigService);

          return {
            description: httpTool.description,
            inputSchema: httpTool.inputSchema,
            execute: (params, workspaceId) =>
              httpTool.execute(params, workspaceId),
            flag: PermissionFlagType.HTTP_REQUEST_TOOL,
          };
        },
      ],
      [
        ToolType.SEND_EMAIL,
        () => ({
          description: this.sendEmailTool.description,
          inputSchema: this.sendEmailTool.inputSchema,
          execute: (params, workspaceId) =>
            this.sendEmailTool.execute(params as SendEmailInput, workspaceId),
          flag: PermissionFlagType.SEND_EMAIL_TOOL,
        }),
      ],
    ]);
  }

  getTool(toolType: ToolType): Tool {
    const factory = this.toolFactories.get(toolType);

    if (!factory) {
      throw new Error(`Unknown tool type: ${toolType}`);
    }

    return factory();
  }

  getAllToolTypes(): ToolType[] {
    return Array.from(this.toolFactories.keys());
  }
}
