import { createState } from 'arjuna-ui/utilities';
export const isRequestingCaptchaTokenState = createState<boolean>({
  key: 'isRequestingCaptchaTokenState',
  defaultValue: false,
});
