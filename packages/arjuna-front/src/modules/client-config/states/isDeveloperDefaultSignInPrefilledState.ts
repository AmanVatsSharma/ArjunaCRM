import { createState } from 'arjuna-ui/utilities';
export const isDeveloperDefaultSignInPrefilledState = createState<boolean>({
  key: 'isDeveloperDefaultSignInPrefilledState',
  defaultValue: false,
});
