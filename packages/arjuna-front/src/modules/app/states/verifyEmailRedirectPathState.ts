import { createState } from 'arjuna-ui/utilities';

export const verifyEmailRedirectPathState = createState<string | undefined>({
  key: 'verifyEmailRedirectPathState',
  defaultValue: undefined,
});
