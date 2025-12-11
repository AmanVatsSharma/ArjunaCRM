import { createState } from 'arjuna-ui/utilities';
export const isMultiWorkspaceEnabledState = createState<boolean>({
  key: 'isMultiWorkspaceEnabled',
  defaultValue: false,
});
