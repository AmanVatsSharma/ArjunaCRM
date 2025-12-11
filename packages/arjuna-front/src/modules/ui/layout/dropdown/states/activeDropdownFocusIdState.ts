import { createState } from 'arjuna-ui/utilities';

export const activeDropdownFocusIdState = createState<string | null>({
  key: 'activeDropdownFocusIdState',
  defaultValue: null,
});
