import { createState } from 'arjuna-ui/utilities';
export const currentMobileNavigationDrawerState = createState<
  'main' | 'settings'
>({
  key: 'currentMobileNavigationDrawerState',
  defaultValue: 'main',
});
