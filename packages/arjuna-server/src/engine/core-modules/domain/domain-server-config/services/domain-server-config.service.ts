import { Injectable } from '@nestjs/common';

import { buildUrlWithPathnameAndSearchParams } from 'src/engine/core-modules/domain/domain-server-config/utils/build-url-with-pathname-and-search-params.util';
import { ArjunaCRMConfigService } from 'src/engine/core-modules/arjuna-config/arjuna-config.service';

@Injectable()
export class DomainServerConfigService {
  constructor(private readonly arjunaConfigService: ArjunaCRMConfigService) {}

  getFrontUrl() {
    return new URL(
      this.arjunaConfigService.get('FRONTEND_URL') ??
        this.arjunaConfigService.get('SERVER_URL'),
    );
  }

  getBaseUrl(): URL {
    const baseUrl = this.getFrontUrl();

    if (
      this.arjunaConfigService.get('IS_MULTIWORKSPACE_ENABLED') &&
      this.arjunaConfigService.get('DEFAULT_SUBDOMAIN')
    ) {
      baseUrl.hostname = `${this.arjunaConfigService.get('DEFAULT_SUBDOMAIN')}.${baseUrl.hostname}`;
    }

    return baseUrl;
  }

  getPublicDomainUrl(): URL {
    return new URL(this.arjunaConfigService.get('PUBLIC_DOMAIN_URL'));
  }

  buildBaseUrl({
    pathname,
    searchParams,
  }: {
    pathname?: string;
    searchParams?: Record<string, string | number>;
  }) {
    return buildUrlWithPathnameAndSearchParams({
      baseUrl: this.getBaseUrl(),
      pathname,
      searchParams,
    });
  }

  getSubdomainAndDomainFromUrl = (url: string) => {
    const { hostname: originHostname } = new URL(url);

    const frontDomain = this.getFrontUrl().hostname;

    const isFrontdomain = originHostname.endsWith(`.${frontDomain}`);

    const subdomain = originHostname.replace(`.${frontDomain}`, '');

    return {
      subdomain:
        isFrontdomain && !this.isDefaultSubdomain(subdomain)
          ? subdomain
          : undefined,
      domain: isFrontdomain ? null : originHostname,
    };
  };

  isDefaultSubdomain(subdomain: string) {
    return subdomain === this.arjunaConfigService.get('DEFAULT_SUBDOMAIN');
  }
}
