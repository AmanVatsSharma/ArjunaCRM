import { createState } from 'arjuna-ui/utilities';
export const isActivityInCreateModeState = createState<boolean>({
  key: 'isActivityInCreateModeState',
  defaultValue: false,
});
