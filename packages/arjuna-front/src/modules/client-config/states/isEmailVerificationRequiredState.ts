import { createState } from 'arjuna-ui/utilities';
export const isEmailVerificationRequiredState = createState<boolean>({
  key: 'isEmailVerificationRequired',
  defaultValue: false,
});
