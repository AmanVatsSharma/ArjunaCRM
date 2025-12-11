import { useAuth } from '@/auth/hooks/useAuth';
import { currentWorkspaceMemberState } from '@/auth/states/currentWorkspaceMemberState';
import { isImpersonatingState } from '@/auth/states/isImpersonatingState';
import { InformationBanner } from '@/information-banner/components/InformationBanner';
import { t } from '@lingui/core/macro';
import { useRecoilValue } from 'recoil';
import { isDefined } from 'arjuna-shared/utils';
import { IconLogout } from 'arjuna-ui/display';

export const InformationBannerIsImpersonating = () => {
  const currentWorkspaceMember = useRecoilValue(currentWorkspaceMemberState);
  const isImpersonating = useRecoilValue(isImpersonatingState);

  const { signOut } = useAuth();

  if (!isDefined(currentWorkspaceMember) || !isImpersonating) {
    return null;
  }

  const impersonatedUser = `${currentWorkspaceMember.name.firstName} ${currentWorkspaceMember.name.lastName} (${currentWorkspaceMember.userEmail})`;

  return (
    <InformationBanner
      componentInstanceId="information-banner-is-impersonating"
      message={t`Logged in as ${impersonatedUser}`}
      buttonTitle={t`Stop impersonating`}
      buttonIcon={IconLogout}
      buttonOnClick={signOut}
    />
  );
};
