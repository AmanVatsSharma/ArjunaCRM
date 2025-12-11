import { createState } from 'arjuna-ui/utilities';

export const qrCodeState = createState<string | null>({
  key: 'qrCodeState',
  defaultValue: null,
});
