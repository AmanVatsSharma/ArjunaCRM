import { PassportStrategy } from '@nestjs/passport';

import { Strategy } from 'passport-microsoft';
import { type VerifyCallback } from 'passport-google-oauth20';

import { getMicrosoftApisOauthScopes } from 'src/engine/core-modules/auth/utils/get-microsoft-apis-oauth-scopes';
import { type ArjunaCRMConfigService } from 'src/engine/core-modules/arjuna-config/arjuna-config.service';

export type MicrosoftAPIScopeConfig = {
  isCalendarEnabled?: boolean;
  isMessagingAliasFetchingEnabled?: boolean;
};

export abstract class MicrosoftAPIsOauthCommonStrategy extends PassportStrategy(
  Strategy,
  'microsoft-apis',
) {
  constructor(arjunaConfigService: ArjunaCRMConfigService) {
    const scopes = getMicrosoftApisOauthScopes();

    super({
      clientID: arjunaConfigService.get('AUTH_MICROSOFT_CLIENT_ID'),
      clientSecret: arjunaConfigService.get('AUTH_MICROSOFT_CLIENT_SECRET'),
      tenant: 'common',
      callbackURL: arjunaConfigService.get('AUTH_MICROSOFT_APIS_CALLBACK_URL'),
      scope: scopes,
      passReqToCallback: true,
    });
  }

  abstract validate(
    request: Express.Request,
    accessToken: string,
    refreshToken: string,
    profile: unknown,
    done: VerifyCallback,
  ): Promise<void>;
}
