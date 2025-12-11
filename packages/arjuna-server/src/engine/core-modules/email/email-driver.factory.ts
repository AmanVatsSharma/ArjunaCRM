import { Injectable } from '@nestjs/common';

import { type EmailDriverInterface } from 'src/engine/core-modules/email/drivers/interfaces/email-driver.interface';

import { LoggerDriver } from 'src/engine/core-modules/email/drivers/logger.driver';
import { SmtpDriver } from 'src/engine/core-modules/email/drivers/smtp.driver';
import { EmailDriver } from 'src/engine/core-modules/email/enums/email-driver.enum';
import { DriverFactoryBase } from 'src/engine/core-modules/arjuna-config/dynamic-factory.base';
import { ConfigVariablesGroup } from 'src/engine/core-modules/arjuna-config/enums/config-variables-group.enum';
import { ArjunaCRMConfigService } from 'src/engine/core-modules/arjuna-config/arjuna-config.service';

@Injectable()
export class EmailDriverFactory extends DriverFactoryBase<EmailDriverInterface> {
  constructor(arjunaConfigService: ArjunaCRMConfigService) {
    super(arjunaConfigService);
  }

  protected buildConfigKey(): string {
    const driver = this.arjunaConfigService.get('EMAIL_DRIVER');

    if (driver === EmailDriver.LOGGER) {
      return 'logger';
    }

    if (driver === EmailDriver.SMTP) {
      const emailConfigHash = this.getConfigGroupHash(
        ConfigVariablesGroup.EMAIL_SETTINGS,
      );

      return `smtp|${emailConfigHash}`;
    }

    throw new Error(`Unsupported email driver: ${driver}`);
  }

  protected createDriver(): EmailDriverInterface {
    const driver = this.arjunaConfigService.get('EMAIL_DRIVER');

    switch (driver) {
      case EmailDriver.LOGGER:
        return new LoggerDriver();

      case EmailDriver.SMTP: {
        const host = this.arjunaConfigService.get('EMAIL_SMTP_HOST');
        const port = this.arjunaConfigService.get('EMAIL_SMTP_PORT');
        const user = this.arjunaConfigService.get('EMAIL_SMTP_USER');
        const pass = this.arjunaConfigService.get('EMAIL_SMTP_PASSWORD');
        const noTLS = this.arjunaConfigService.get('EMAIL_SMTP_NO_TLS');

        if (!host || !port) {
          throw new Error('SMTP driver requires host and port to be defined');
        }

        const options: {
          host: string;
          port: number;
          auth?: { user: string; pass: string };
          secure?: boolean;
          ignoreTLS?: boolean;
          requireTLS?: boolean;
        } = { host, port };

        if (user && pass) {
          options.auth = { user, pass };
        }

        if (noTLS) {
          options.secure = false;
          options.ignoreTLS = true;
        }

        return new SmtpDriver(options);
      }

      default:
        throw new Error(`Invalid email driver: ${driver}`);
    }
  }
}
