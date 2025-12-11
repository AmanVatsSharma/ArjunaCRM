import { type IconComponent } from 'arjuna-ui/display';
import { Tag } from 'arjuna-ui/components';
import { type ThemeColor } from 'arjuna-ui/theme';

type SelectDisplayProps = {
  color: ThemeColor | 'transparent';
  label: string;
  Icon?: IconComponent;
  preventPadding?: boolean;
};

export const SelectDisplay = ({
  color,
  label,
  Icon,
  preventPadding,
}: SelectDisplayProps) => {
  return (
    <Tag
      preventShrink
      color={color}
      text={label}
      Icon={Icon}
      preventPadding={preventPadding}
    />
  );
};
