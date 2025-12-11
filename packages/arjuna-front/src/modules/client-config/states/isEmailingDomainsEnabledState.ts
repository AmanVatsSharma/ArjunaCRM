import { createState } from 'arjuna-ui/utilities';

export const isEmailingDomainsEnabledState = createState<boolean>({
  key: 'isEmailingDomainsEnabled',
  defaultValue: false,
});
