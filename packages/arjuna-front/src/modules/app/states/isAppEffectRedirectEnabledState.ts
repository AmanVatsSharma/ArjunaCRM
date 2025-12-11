import { createState } from 'arjuna-ui/utilities';
export const isAppEffectRedirectEnabledState = createState<boolean>({
  key: 'isAppEffectRedirectEnabledState',
  defaultValue: true,
});
