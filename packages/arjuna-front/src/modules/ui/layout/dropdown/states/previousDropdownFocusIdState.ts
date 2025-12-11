import { createState } from 'arjuna-ui/utilities';

export const previousDropdownFocusIdState = createState<string | null>({
  key: 'previousDropdownFocusIdState',
  defaultValue: null,
});
