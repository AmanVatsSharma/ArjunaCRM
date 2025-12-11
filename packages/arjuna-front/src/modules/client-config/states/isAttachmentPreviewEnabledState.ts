import { createState } from 'arjuna-ui/utilities';
export const isAttachmentPreviewEnabledState = createState<boolean>({
  key: 'isAttachmentPreviewEnabled',
  defaultValue: false,
});
