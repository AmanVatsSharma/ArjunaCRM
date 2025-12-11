import { createState } from 'arjuna-ui/utilities';
export const captchaTokenState = createState<string | undefined>({
  key: 'captchaTokenState',
  defaultValue: undefined,
});
