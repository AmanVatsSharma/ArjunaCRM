import { SettingsPageContainer } from '@/settings/components/SettingsPageContainer';
import { LinkDisplay } from '@/ui/field/display/components/LinkDisplay';
import { SubMenuTopBarContainer } from '@/ui/layout/page/components/SubMenuTopBarContainer';
import styled from '@emotion/styled';
import { t } from '@lingui/core/macro';
import { SettingsPath } from 'arjuna-shared/types';
import { getSettingsPath } from 'arjuna-shared/utils';
import { Section } from 'arjuna-ui/layout';
import { useFindManyApplicationsQuery } from '~/generated-metadata/graphql';
import { SettingsApplicationsTable } from '~/pages/settings/applications/components/SettingsApplicationsTable';

const StyledNoApplicationContainer = styled.div``;

export const SettingsApplications = () => {
  const { data } = useFindManyApplicationsQuery();

  const applications = data?.findManyApplications ?? [];

  return (
    <SubMenuTopBarContainer
      title={t`Applications`}
      links={[
        {
          children: t`Workspace`,
          href: getSettingsPath(SettingsPath.Workspace),
        },
        { children: t`Applications` },
      ]}
    >
      <SettingsPageContainer>
        <Section>
          {applications.length > 0 ? (
            <SettingsApplicationsTable applications={applications} />
          ) : (
            <StyledNoApplicationContainer>
              No installed application. Please check our{' '}
              <LinkDisplay
                value={{
                  url: 'https://www.npmjs.com/package/arjuna-cli',
                  label: 'arjuna-cli',
                }}
              />
            </StyledNoApplicationContainer>
          )}
        </Section>
      </SettingsPageContainer>
    </SubMenuTopBarContainer>
  );
};
