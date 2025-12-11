import { createState } from 'arjuna-ui/utilities';
export const isAnalyticsEnabledState = createState<boolean>({
  key: 'isAnalyticsEnabled',
  defaultValue: false,
});
