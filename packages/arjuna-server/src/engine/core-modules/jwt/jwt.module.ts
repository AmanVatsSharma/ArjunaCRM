import { Module } from '@nestjs/common';
import { JwtModule as NestJwtModule } from '@nestjs/jwt';

import { JwtWrapperService } from 'src/engine/core-modules/jwt/services/jwt-wrapper.service';
import { ArjunaCRMConfigModule } from 'src/engine/core-modules/arjuna-config/arjuna-config.module';
import { ArjunaCRMConfigService } from 'src/engine/core-modules/arjuna-config/arjuna-config.service';

const InternalJwtModule = NestJwtModule.registerAsync({
  useFactory: async (arjunaConfigService: ArjunaCRMConfigService) => {
    return {
      secret: arjunaConfigService.get('APP_SECRET'),
      signOptions: {
        expiresIn: arjunaConfigService.get('ACCESS_TOKEN_EXPIRES_IN'),
      },
    };
  },
  inject: [ArjunaCRMConfigService],
});

@Module({
  imports: [InternalJwtModule, ArjunaCRMConfigModule],
  controllers: [],
  providers: [JwtWrapperService],
  exports: [JwtWrapperService],
})
export class JwtModule {}
