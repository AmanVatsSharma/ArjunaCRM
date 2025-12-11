import {
  type CaptchaDriverOptions,
  type CaptchaModuleOptions,
} from 'src/engine/core-modules/captcha/interfaces';
import { type ArjunaCRMConfigService } from 'src/engine/core-modules/arjuna-config/arjuna-config.service';

export const captchaModuleFactory = (
  arjunaConfigService: ArjunaCRMConfigService,
): CaptchaModuleOptions | undefined => {
  const driver = arjunaConfigService.get('CAPTCHA_DRIVER');
  const siteKey = arjunaConfigService.get('CAPTCHA_SITE_KEY');
  const secretKey = arjunaConfigService.get('CAPTCHA_SECRET_KEY');

  if (!driver) {
    return;
  }

  if (!siteKey || !secretKey) {
    throw new Error('Captcha driver requires site key and secret key');
  }

  const captchaOptions: CaptchaDriverOptions = {
    siteKey,
    secretKey,
  };

  return {
    type: driver,
    options: captchaOptions,
  };
};
