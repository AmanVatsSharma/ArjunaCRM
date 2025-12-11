import { Injectable, type OnModuleDestroy } from '@nestjs/common';

import IORedis from 'ioredis';
import { isDefined } from 'arjuna-shared/utils';

import { ArjunaCRMConfigService } from 'src/engine/core-modules/arjuna-config/arjuna-config.service';

@Injectable()
export class RedisClientService implements OnModuleDestroy {
  private redisClient: IORedis | null = null;
  private redisQueueClient: IORedis | null = null;

  constructor(private readonly arjunaConfigService: ArjunaCRMConfigService) {}

  getQueueClient() {
    if (!this.redisQueueClient) {
      const redisQueueUrl =
        this.arjunaConfigService.get('REDIS_QUEUE_URL') ??
        this.arjunaConfigService.get('REDIS_URL');

      if (!redisQueueUrl) {
        throw new Error('REDIS_QUEUE_URL or REDIS_URL must be defined');
      }

      this.redisQueueClient = new IORedis(redisQueueUrl, {
        maxRetriesPerRequest: null,
      });
    }

    return this.redisQueueClient;
  }

  getClient() {
    if (!this.redisClient) {
      const redisUrl = this.arjunaConfigService.get('REDIS_URL');

      if (!redisUrl) {
        throw new Error('REDIS_URL must be defined');
      }

      this.redisClient = new IORedis(redisUrl, {
        maxRetriesPerRequest: null,
      });
    }

    return this.redisClient;
  }

  async onModuleDestroy() {
    if (isDefined(this.redisQueueClient)) {
      await this.redisQueueClient.quit();
      this.redisQueueClient = null;
    }
    if (isDefined(this.redisClient)) {
      await this.redisClient.quit();
      this.redisClient = null;
    }
  }
}
