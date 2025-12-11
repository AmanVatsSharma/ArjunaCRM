import { Module } from '@nestjs/common';

import { ArjunaCRMConfigModule } from 'src/engine/core-modules/arjuna-config/arjuna-config.module';
import { CalDavClientProvider } from 'src/modules/calendar/calendar-event-import-manager/drivers/caldav/providers/caldav.provider';
import { CalDavGetEventsService } from 'src/modules/calendar/calendar-event-import-manager/drivers/caldav/services/caldav-get-events.service';

@Module({
  imports: [ArjunaCRMConfigModule],
  providers: [CalDavClientProvider, CalDavGetEventsService],
  exports: [CalDavGetEventsService],
})
export class CalDavDriverModule {}
