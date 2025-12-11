import { createState } from 'arjuna-ui/utilities';
export const isGoogleCalendarEnabledState = createState<boolean>({
  key: 'isGoogleCalendarEnabled',
  defaultValue: false,
});
