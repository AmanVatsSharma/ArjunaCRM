import { createState } from 'arjuna-ui/utilities';

export const recordIndexCalendarFieldMetadataIdState = createState<
  string | null
>({
  key: 'recordIndexCalendarFieldMetadataIdState',
  defaultValue: null,
});
