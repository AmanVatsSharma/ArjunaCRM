import { createState } from 'arjuna-ui/utilities';
export const isMicrosoftMessagingEnabledState = createState<boolean>({
  key: 'isMicrosoftMessagingEnabled',
  defaultValue: false,
});
