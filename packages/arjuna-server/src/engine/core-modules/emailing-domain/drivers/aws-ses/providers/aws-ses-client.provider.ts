import { Injectable } from '@nestjs/common';

import {
  SESv2Client as SESClient,
  type SESv2ClientConfig as SESClientConfig,
} from '@aws-sdk/client-sesv2';

import { ArjunaCRMConfigService } from 'src/engine/core-modules/arjuna-config/arjuna-config.service';

@Injectable()
export class AwsSesClientProvider {
  private sesClient: SESClient | null = null;

  constructor(private readonly arjunaConfigService: ArjunaCRMConfigService) {}

  public getSESClient(): SESClient {
    if (!this.sesClient) {
      const config: SESClientConfig = {
        region: this.arjunaConfigService.get('AWS_SES_REGION'),
      };

      const accessKeyId = this.arjunaConfigService.get('AWS_SES_ACCESS_KEY_ID');
      const secretAccessKey = this.arjunaConfigService.get(
        'AWS_SES_SECRET_ACCESS_KEY',
      );
      const sessionToken = this.arjunaConfigService.get(
        'AWS_SES_SESSION_TOKEN',
      );

      if (accessKeyId && secretAccessKey && sessionToken) {
        config.credentials = {
          accessKeyId,
          secretAccessKey,
          sessionToken,
        };
      }

      this.sesClient = new SESClient(config);
    }

    return this.sesClient;
  }
}
