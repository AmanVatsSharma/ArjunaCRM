import { createState } from 'arjuna-ui/utilities';
export const isCaptchaScriptLoadedState = createState<boolean>({
  key: 'isCaptchaScriptLoadedState',
  defaultValue: false,
});
