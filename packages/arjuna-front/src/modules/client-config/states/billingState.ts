import { type Billing } from '~/generated/graphql';
import { createState } from 'arjuna-ui/utilities';

export const billingState = createState<Billing | null>({
  key: 'billingState',
  defaultValue: null,
});
