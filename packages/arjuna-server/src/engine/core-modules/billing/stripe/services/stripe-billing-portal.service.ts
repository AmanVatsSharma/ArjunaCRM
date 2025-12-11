/* @license Enterprise */

import { Injectable, Logger } from '@nestjs/common';

import type Stripe from 'stripe';

import { StripeSDKService } from 'src/engine/core-modules/billing/stripe/stripe-sdk/services/stripe-sdk.service';
import { DomainServerConfigService } from 'src/engine/core-modules/domain/domain-server-config/services/domain-server-config.service';
import { ArjunaCRMConfigService } from 'src/engine/core-modules/arjuna-config/arjuna-config.service';

@Injectable()
export class StripeBillingPortalService {
  protected readonly logger = new Logger(StripeBillingPortalService.name);
  private readonly stripe: Stripe;

  constructor(
    private readonly arjunaConfigService: ArjunaCRMConfigService,
    private readonly domainServerConfigService: DomainServerConfigService,
    private readonly stripeSDKService: StripeSDKService,
  ) {
    if (!this.arjunaConfigService.get('IS_BILLING_ENABLED')) {
      return;
    }
    this.stripe = this.stripeSDKService.getStripe(
      this.arjunaConfigService.get('BILLING_STRIPE_API_KEY'),
    );
  }

  async createBillingPortalSession(
    stripeCustomerId: string,
    returnUrl?: string,
  ): Promise<Stripe.BillingPortal.Session> {
    return await this.stripe.billingPortal.sessions.create({
      customer: stripeCustomerId,
      return_url:
        returnUrl ?? this.domainServerConfigService.getBaseUrl().toString(),
    });
  }
}
