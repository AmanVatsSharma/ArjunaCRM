import styled from '@emotion/styled';
import { AnimatedContainer } from 'arjuna-ui/utilities';
import { FloatingIconButton } from 'arjuna-ui/input';
import { type IconComponent } from 'arjuna-ui/display';
import { MOBILE_VIEWPORT } from 'arjuna-ui/theme';

const StyledButtonContainer = styled.div`
  margin: ${({ theme }) => theme.spacing(1)};
  @media (max-width: ${MOBILE_VIEWPORT}px) {
    position: relative;
    right: 7px;
  }
`;

type RecordTableCellButtonProps = {
  onClick?: () => void;
  Icon: IconComponent;
};

export const RecordTableCellButton = ({
  onClick,
  Icon,
}: RecordTableCellButtonProps) => (
  <AnimatedContainer>
    <StyledButtonContainer>
      <FloatingIconButton size="small" onClick={onClick} Icon={Icon} />
    </StyledButtonContainer>
  </AnimatedContainer>
);
