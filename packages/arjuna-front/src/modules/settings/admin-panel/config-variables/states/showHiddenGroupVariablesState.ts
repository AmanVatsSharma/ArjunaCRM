import { createState } from 'arjuna-ui/utilities';

export const showHiddenGroupVariablesState = createState<boolean>({
  key: 'showHiddenGroupVariablesState',
  defaultValue: false,
});
