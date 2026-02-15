import { I18nProvider } from '@lingui/react';
import { Container, Html } from '@react-email/components';
import { type ComponentProps } from 'react';

import { BaseHead } from 'src/components/BaseHead';
import { Footer } from 'src/components/Footer';
import { Logo } from 'src/components/Logo';
import { createI18nInstance } from 'src/utils/i18n.utils';
import { type APP_LOCALES } from 'arjuna-shared/translations';

type BaseEmailProps = {
  children: JSX.Element | JSX.Element[] | string;
  width?: number;
  locale: keyof typeof APP_LOCALES;
};

export const BaseEmail = ({ children, width, locale }: BaseEmailProps) => {
  const i18nInstance = createI18nInstance(locale);
  const i18nProviderInstance =
    i18nInstance as unknown as ComponentProps<typeof I18nProvider>['i18n'];

  return (
    <I18nProvider i18n={i18nProviderInstance}>
      <Html lang={locale}>
        <BaseHead />
        <Container width={width || 290}>
          <Logo />
          {children}
          <Footer i18n={i18nInstance} />
        </Container>
      </Html>
    </I18nProvider>
  );
};
