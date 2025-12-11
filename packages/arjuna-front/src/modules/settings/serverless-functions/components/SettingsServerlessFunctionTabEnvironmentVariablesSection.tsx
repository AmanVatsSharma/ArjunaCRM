import { H2Title } from 'arjuna-ui/display';
import { Section } from 'arjuna-ui/layout';
import { SettingsPath } from 'arjuna-shared/types';
import { LinkChip } from 'arjuna-ui/components';
import { getSettingsPath } from 'arjuna-shared/utils';
import { useParams } from 'react-router-dom';
import { t } from '@lingui/core/macro';

export const SettingsServerlessFunctionTabEnvironmentVariablesSection = () => {
  const { applicationId = '' } = useParams<{ applicationId: string }>();
  return (
    <Section>
      <H2Title
        title={t`Environment Variables`}
        description="Accessible in your function via process.env.KEY"
      />
      Environment variables are defined at application level for all functions.
      Please check{' '}
      <LinkChip
        label={'application detail page'}
        to={getSettingsPath(
          SettingsPath.ApplicationDetail,
          {
            applicationId,
          },
          undefined,
          'settings',
        )}
      />
      .
    </Section>
  );
};
