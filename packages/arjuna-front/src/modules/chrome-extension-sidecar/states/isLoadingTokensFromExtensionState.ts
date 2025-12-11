import { createState } from 'arjuna-ui/utilities';
export const isLoadingTokensFromExtensionState = createState<boolean | null>({
  key: 'isLoadingTokensFromExtensionState',
  defaultValue: null,
});
