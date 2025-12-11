import { createState } from 'arjuna-ui/utilities';

export const appVersionState = createState<string | undefined>({
  key: 'appVersion',
  defaultValue: undefined,
});
