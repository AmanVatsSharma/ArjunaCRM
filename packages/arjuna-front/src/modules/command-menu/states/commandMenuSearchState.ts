import { createState } from 'arjuna-ui/utilities';
export const commandMenuSearchState = createState<string>({
  key: 'command-menu/commandMenuSearchState',
  defaultValue: '',
});
