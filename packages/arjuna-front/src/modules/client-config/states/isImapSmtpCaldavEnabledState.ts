import { createState } from 'arjuna-ui/utilities';
export const isImapSmtpCaldavEnabledState = createState<boolean>({
  key: 'isImapSmtpCaldavEnabled',
  defaultValue: false,
});
