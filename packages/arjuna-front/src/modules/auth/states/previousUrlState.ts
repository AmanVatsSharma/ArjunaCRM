import { createState } from 'arjuna-ui/utilities';
export const previousUrlState = createState<string>({
  key: 'previousUrlState',
  defaultValue: '',
});
