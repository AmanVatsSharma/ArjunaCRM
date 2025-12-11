import { type IconComponent } from 'arjuna-ui/display';
import { createState } from 'arjuna-ui/utilities';

export const commandMenuPageInfoState = createState<{
  title?: string;
  Icon?: IconComponent;
  instanceId: string;
}>({
  key: 'command-menu/commandMenuPageInfoState',
  defaultValue: {
    title: undefined,
    Icon: undefined,
    instanceId: '',
  },
});
