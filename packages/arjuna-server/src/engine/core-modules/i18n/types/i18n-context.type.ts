import { type APP_LOCALES } from 'arjuna-shared/translations';
export type I18nContext = {
  req: {
    locale: keyof typeof APP_LOCALES;
  };
};
