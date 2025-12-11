import {
  StyledContainer,
  StyledDialog,
  StyledHeading,
} from './KeyboardShortcutMenuStyles';
import { IconButton } from 'arjuna-ui/input';
import { IconX } from 'arjuna-ui/display';

type KeyboardMenuDialogProps = {
  onClose: () => void;
  children: React.ReactNode | React.ReactNode[];
};

export const KeyboardMenuDialog = ({
  onClose,
  children,
}: KeyboardMenuDialogProps) => {
  return (
    <StyledDialog>
      <StyledHeading>
        Keyboard shortcuts
        <IconButton variant="tertiary" Icon={IconX} onClick={onClose} />
      </StyledHeading>
      <StyledContainer>{children}</StyledContainer>
    </StyledDialog>
  );
};
