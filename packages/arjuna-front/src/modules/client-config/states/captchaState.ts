import { type Captcha } from '~/generated/graphql';
import { createState } from 'arjuna-ui/utilities';

export const captchaState = createState<Captcha | null>({
  key: 'captchaState',
  defaultValue: null,
});
