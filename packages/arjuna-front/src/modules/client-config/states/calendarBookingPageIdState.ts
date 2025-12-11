import { createState } from 'arjuna-ui/utilities';

export const calendarBookingPageIdState = createState<string | null>({
  key: 'calendarBookingPageIdState',
  defaultValue: null,
});
