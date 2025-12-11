import { type ClientConfig } from '@/client-config/types/ClientConfig';
import { createState } from 'arjuna-ui/utilities';

export const domainConfigurationState = createState<
  Pick<ClientConfig, 'frontDomain' | 'defaultSubdomain'>
>({
  key: 'domainConfiguration',
  defaultValue: {
    frontDomain: '',
    defaultSubdomain: undefined,
  },
});
