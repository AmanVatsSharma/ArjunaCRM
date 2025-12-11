import { createState } from 'arjuna-ui/utilities';

export const isMergeInProgressState = createState<boolean>({
  key: 'isMergeInProgress',
  defaultValue: false,
});
