/* @license Enterprise */

import {
  type CanActivate,
  type ExecutionContext,
  Injectable,
} from '@nestjs/common';

import {
  AuthException,
  AuthExceptionCode,
} from 'src/engine/core-modules/auth/auth.exception';
import { GuardRedirectService } from 'src/engine/core-modules/guard-redirect/services/guard-redirect.service';
import { ArjunaCRMConfigService } from 'src/engine/core-modules/arjuna-config/arjuna-config.service';

@Injectable()
export class EnterpriseFeaturesEnabledGuard implements CanActivate {
  constructor(
    private readonly guardRedirectService: GuardRedirectService,
    private readonly arjunaConfigService: ArjunaCRMConfigService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    try {
      if (!this.arjunaConfigService.get('ENTERPRISE_KEY')) {
        throw new AuthException(
          'Enterprise key missing',
          AuthExceptionCode.MISSING_ENVIRONMENT_VARIABLE,
        );
      }

      return true;
    } catch (err) {
      this.guardRedirectService.dispatchErrorFromGuard(
        context,
        err,
        this.guardRedirectService.getSubdomainAndCustomDomainFromContext(
          context,
        ),
      );

      return false;
    }
  }
}
