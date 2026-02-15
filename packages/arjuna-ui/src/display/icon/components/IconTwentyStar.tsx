import { useTheme } from '@emotion/react';

import IconArjunaCRMStarRaw from '@assets/icons/twenty-star.svg?react';
import { type IconComponentProps } from '@ui/display/icon/types/IconComponent';

type IconArjunaCRMStarProps = Pick<IconComponentProps, 'size' | 'stroke'>;

export const IconArjunaCRMStar = (props: IconArjunaCRMStarProps) => {
  const theme = useTheme();
  const size = props.size ?? 24;
  const stroke = props.stroke ?? theme.icon.stroke.md;

  return <IconArjunaCRMStarRaw height={size} width={size} strokeWidth={stroke} />;
};
