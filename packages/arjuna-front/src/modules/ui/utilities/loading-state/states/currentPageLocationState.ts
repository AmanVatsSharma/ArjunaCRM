import { createState } from 'arjuna-ui/utilities';
export const currentPageLocationState = createState<string>({
  key: 'currentPageLocationState',
  defaultValue: '',
});
