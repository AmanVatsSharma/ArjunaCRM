import { createState } from 'arjuna-ui/utilities';
export const canManageFeatureFlagsState = createState<boolean>({
  key: 'canManageFeatureFlagsState',
  defaultValue: false,
});
