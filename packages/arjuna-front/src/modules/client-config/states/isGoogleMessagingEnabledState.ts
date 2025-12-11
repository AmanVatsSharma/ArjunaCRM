import { createState } from 'arjuna-ui/utilities';
export const isGoogleMessagingEnabledState = createState<boolean>({
  key: 'isGoogleMessagingEnabled',
  defaultValue: false,
});
