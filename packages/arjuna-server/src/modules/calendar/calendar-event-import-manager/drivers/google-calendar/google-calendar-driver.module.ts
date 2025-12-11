import { Module } from '@nestjs/common';

import { ArjunaCRMConfigModule } from 'src/engine/core-modules/arjuna-config/arjuna-config.module';
import { GoogleCalendarGetEventsService } from 'src/modules/calendar/calendar-event-import-manager/drivers/google-calendar/services/google-calendar-get-events.service';
import { OAuth2ClientManagerModule } from 'src/modules/connected-account/oauth2-client-manager/oauth2-client-manager.module';

@Module({
  imports: [ArjunaCRMConfigModule, OAuth2ClientManagerModule],
  providers: [GoogleCalendarGetEventsService],
  exports: [GoogleCalendarGetEventsService],
})
export class GoogleCalendarDriverModule {}
