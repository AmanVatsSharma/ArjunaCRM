import { createState } from 'arjuna-ui/utilities';

export const workspaceBypassModeState = createState<boolean>({
  key: 'workspaceBypassModeState',
  defaultValue: false,
});
