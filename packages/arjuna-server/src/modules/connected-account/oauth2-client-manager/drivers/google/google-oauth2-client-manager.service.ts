import { Injectable, Logger } from '@nestjs/common';

import { google, type Auth } from 'googleapis';

import { ArjunaCRMConfigService } from 'src/engine/core-modules/arjuna-config/arjuna-config.service';

@Injectable()
export class GoogleOAuth2ClientManagerService {
  constructor(
    private readonly arjunaConfigService: ArjunaCRMConfigService,
    private readonly logger: Logger,
  ) {}

  public async getOAuth2Client(
    refreshToken: string,
  ): Promise<Auth.OAuth2Client> {
    const gmailClientId = this.arjunaConfigService.get('AUTH_GOOGLE_CLIENT_ID');
    const gmailClientSecret = this.arjunaConfigService.get(
      'AUTH_GOOGLE_CLIENT_SECRET',
    );

    try {
      const oAuth2Client = new google.auth.OAuth2(
        gmailClientId,
        gmailClientSecret,
      );

      oAuth2Client.setCredentials({
        refresh_token: refreshToken,
      });

      return oAuth2Client;
    } catch (error) {
      this.logger.error(
        `Error in ${GoogleOAuth2ClientManagerService.name}`,
        error,
      );

      throw error;
    }
  }
}
