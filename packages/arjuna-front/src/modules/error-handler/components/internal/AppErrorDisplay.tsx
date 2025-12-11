import { type AppErrorDisplayProps } from '@/error-handler/types/AppErrorDisplayProps';
import { t } from '@lingui/core/macro';
import { IconRefresh } from 'arjuna-ui/display';
import { Button } from 'arjuna-ui/input';
import {
  AnimatedPlaceholder,
  AnimatedPlaceholderEmptyContainer,
  AnimatedPlaceholderEmptySubTitle,
  AnimatedPlaceholderEmptyTextContainer,
  AnimatedPlaceholderEmptyTitle,
} from 'arjuna-ui/layout';

export const AppErrorDisplay = ({
  resetErrorBoundary,
  title = 'Sorry, something went wrong',
}: AppErrorDisplayProps) => {
  return (
    <AnimatedPlaceholderEmptyContainer>
      <AnimatedPlaceholder type="errorIndex" />
      <AnimatedPlaceholderEmptyTextContainer>
        <AnimatedPlaceholderEmptyTitle>{title}</AnimatedPlaceholderEmptyTitle>
        <AnimatedPlaceholderEmptySubTitle>
          {t`Please refresh the page.`}
        </AnimatedPlaceholderEmptySubTitle>
      </AnimatedPlaceholderEmptyTextContainer>
      <Button
        Icon={IconRefresh}
        title={t`Reload`}
        variant="secondary"
        onClick={resetErrorBoundary}
      />
    </AnimatedPlaceholderEmptyContainer>
  );
};
