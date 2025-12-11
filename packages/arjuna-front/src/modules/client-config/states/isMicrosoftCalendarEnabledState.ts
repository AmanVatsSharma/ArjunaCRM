import { createState } from 'arjuna-ui/utilities';
export const isMicrosoftCalendarEnabledState = createState<boolean>({
  key: 'isMicrosoftCalendarEnabled',
  defaultValue: false,
});
