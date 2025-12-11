import { createState } from 'arjuna-ui/utilities';
export const navigationMemorizedUrlState = createState<string>({
  key: 'navigationMemorizedUrlState',
  defaultValue: '/',
});
