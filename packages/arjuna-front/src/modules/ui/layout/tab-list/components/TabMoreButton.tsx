import styled from '@emotion/styled';
import { t } from '@lingui/core/macro';
import { IconChevronDown } from 'arjuna-ui/display';
import { TabButton } from 'arjuna-ui/input';

const StyledTabMoreButton = styled(TabButton)`
  height: ${({ theme }) => theme.spacing(10)};
`;

export const TabMoreButton = ({
  hiddenTabsCount,
  active,
  className,
}: {
  hiddenTabsCount: number;
  active: boolean;
  className?: string;
}) => {
  return (
    <StyledTabMoreButton
      id="tab-more-button"
      active={active}
      title={`+${hiddenTabsCount} ${t`More`}`}
      RightIcon={IconChevronDown}
      className={className}
    />
  );
};
