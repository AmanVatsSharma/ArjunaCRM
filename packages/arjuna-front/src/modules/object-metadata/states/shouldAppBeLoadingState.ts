import { createState } from 'arjuna-ui/utilities';
export const shouldAppBeLoadingState = createState<boolean>({
  key: 'shouldAppBeLoadingState',
  defaultValue: false,
});
