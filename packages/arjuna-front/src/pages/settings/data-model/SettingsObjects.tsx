import { useFilteredObjectMetadataItems } from '@/object-metadata/hooks/useFilteredObjectMetadataItems';
import { SettingsPageContainer } from '@/settings/components/SettingsPageContainer';

import { SettingsObjectCoverImage } from '@/settings/data-model/objects/components/SettingsObjectCoverImage';
import { SubMenuTopBarContainer } from '@/ui/layout/page/components/SubMenuTopBarContainer';
import { Trans, useLingui } from '@lingui/react/macro';
import { SettingsPath } from 'arjuna-shared/types';
import { getSettingsPath } from 'arjuna-shared/utils';
import { H2Title, IconPlus } from 'arjuna-ui/display';
import { Button } from 'arjuna-ui/input';
import { Section } from 'arjuna-ui/layout';
import { UndecoratedLink } from 'arjuna-ui/navigation';
import { SettingsObjectTable } from '~/pages/settings/data-model/SettingsObjectTable';

export const SettingsObjects = () => {
  const { t } = useLingui();

  const { objectMetadataItems } = useFilteredObjectMetadataItems();

  return (
    <SubMenuTopBarContainer
      title={t`Data model`}
      actionButton={
        <UndecoratedLink to={getSettingsPath(SettingsPath.NewObject)}>
          <Button
            Icon={IconPlus}
            title={t`Add object`}
            accent="blue"
            size="small"
          />
        </UndecoratedLink>
      }
      links={[
        {
          children: <Trans>Workspace</Trans>,
          href: getSettingsPath(SettingsPath.Workspace),
        },
        { children: <Trans>Objects</Trans> },
      ]}
    >
      <SettingsPageContainer>
        <>
          <SettingsObjectCoverImage />
          <Section>
            <H2Title title={t`Existing objects`} />

            <SettingsObjectTable objectMetadataItems={objectMetadataItems} />
          </Section>
        </>
      </SettingsPageContainer>
    </SubMenuTopBarContainer>
  );
};
