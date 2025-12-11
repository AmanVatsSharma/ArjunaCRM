import { createState } from 'arjuna-ui/utilities';

export const lastShowPageRecordIdState = createState<string | null>({
  key: 'lastShowPageRecordIdState',
  defaultValue: null,
});
