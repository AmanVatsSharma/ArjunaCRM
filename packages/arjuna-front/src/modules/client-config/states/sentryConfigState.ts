import { type Sentry } from '~/generated/graphql';
import { createState } from 'arjuna-ui/utilities';

export const sentryConfigState = createState<Sentry | null>({
  key: 'sentryConfigState',
  defaultValue: null,
});
