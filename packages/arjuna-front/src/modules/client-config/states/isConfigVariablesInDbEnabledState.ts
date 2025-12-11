import { createState } from 'arjuna-ui/utilities';
export const isConfigVariablesInDbEnabledState = createState<boolean>({
  key: 'isConfigVariablesInDbEnabled',
  defaultValue: false,
});
