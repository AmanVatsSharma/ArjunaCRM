import { Global, Module } from '@nestjs/common';

import { RedisClientService } from 'src/engine/core-modules/redis-client/redis-client.service';
import { ArjunaCRMConfigModule } from 'src/engine/core-modules/arjuna-config/arjuna-config.module';

@Global()
@Module({
  imports: [ArjunaCRMConfigModule],
  providers: [RedisClientService],
  exports: [RedisClientService],
})
export class RedisClientModule {}
