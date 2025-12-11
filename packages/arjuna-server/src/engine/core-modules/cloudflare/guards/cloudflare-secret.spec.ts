import { type ExecutionContext } from '@nestjs/common';

import * as crypto from 'crypto';

import { type ArjunaCRMConfigService } from 'src/engine/core-modules/arjuna-config/arjuna-config.service';
import { CloudflareSecretMatchGuard } from 'src/engine/core-modules/cloudflare/guards/cloudflare-secret.guard';

describe('CloudflareSecretMatchGuard.canActivate', () => {
  let guard: CloudflareSecretMatchGuard;
  let arjunaConfigService: ArjunaCRMConfigService;

  beforeEach(() => {
    arjunaConfigService = {
      get: jest.fn(),
    } as unknown as ArjunaCRMConfigService;
    guard = new CloudflareSecretMatchGuard(arjunaConfigService);
  });

  it('should return true when the webhook secret matches', () => {
    const mockRequest = { headers: { 'cf-webhook-auth': 'valid-secret' } };

    jest.spyOn(arjunaConfigService, 'get').mockReturnValue('valid-secret');

    const mockContext = {
      switchToHttp: () => ({
        getRequest: () => mockRequest,
      }),
    } as unknown as ExecutionContext;

    jest.spyOn(crypto, 'timingSafeEqual').mockReturnValue(true);

    expect(guard.canActivate(mockContext)).toBe(true);
  });

  it('should return true when env is not set', () => {
    const mockRequest = { headers: { 'cf-webhook-auth': 'valid-secret' } };

    jest.spyOn(arjunaConfigService, 'get').mockReturnValue(undefined);

    const mockContext = {
      switchToHttp: () => ({
        getRequest: () => mockRequest,
      }),
    } as unknown as ExecutionContext;

    jest.spyOn(crypto, 'timingSafeEqual').mockReturnValue(true);

    expect(guard.canActivate(mockContext)).toBe(true);
  });

  it('should return false if an error occurs', () => {
    const mockRequest = { headers: {} };

    jest.spyOn(arjunaConfigService, 'get').mockReturnValue('valid-secret');

    const mockContext = {
      switchToHttp: () => ({
        getRequest: () => mockRequest,
      }),
    } as unknown as ExecutionContext;

    expect(guard.canActivate(mockContext)).toBe(false);
  });
});
