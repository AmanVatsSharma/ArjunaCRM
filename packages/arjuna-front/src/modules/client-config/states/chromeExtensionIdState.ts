import { createState } from 'arjuna-ui/utilities';
export const chromeExtensionIdState = createState<string | null | undefined>({
  key: 'chromeExtensionIdState',
  defaultValue: null,
});
