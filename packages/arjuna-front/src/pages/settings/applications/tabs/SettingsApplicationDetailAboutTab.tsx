import { SettingsTextInput } from '@/ui/input/components/SettingsTextInput';
import { t } from '@lingui/core/macro';
import { isDefined } from 'arjuna-shared/utils';
import { H2Title } from 'arjuna-ui/display';
import { Section } from 'arjuna-ui/layout';
import type { Application } from '~/generated/graphql';
import { SettingsApplicationVersionContainer } from '~/pages/settings/applications/components/SettingsApplicationVersionContainer';

export const SettingsApplicationDetailAboutTab = ({
  application,
}: {
  application?: Omit<Application, 'objects' | 'universalIdentifier'> & {
    objects: { id: string }[];
  };
}) => {
  if (!isDefined(application)) {
    return null;
  }

  const { id, name, description } = application;

  return (
    <>
      <Section>
        <H2Title title={t`Name`} description={t`Name of the application`} />
        <SettingsTextInput
          instanceId={`application-name-${id}`}
          value={name}
          disabled
          fullWidth
        />
      </Section>
      <Section>
        <H2Title
          title={t`Description`}
          description={t`Description of the application`}
        />
        <SettingsTextInput
          instanceId={`application-description-${id}`}
          value={description}
          disabled
          fullWidth
        />
      </Section>
      <Section>
        <H2Title
          title={t`Version`}
          description={t`Version of the application`}
        />
        <SettingsApplicationVersionContainer application={application} />
      </Section>
    </>
  );
};
