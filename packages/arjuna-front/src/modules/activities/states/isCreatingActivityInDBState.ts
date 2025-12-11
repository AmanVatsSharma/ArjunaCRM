import { createState } from 'arjuna-ui/utilities';
export const isUpsertingActivityInDBState = createState<boolean>({
  key: 'isUpsertingActivityInDBState',
  defaultValue: false,
});
