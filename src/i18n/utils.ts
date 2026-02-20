import type { Lang, TranslationKey } from './ui';
import { defaultLang, ui } from './ui';

export function useTranslations(locale: Lang) {
  return function t(key: TranslationKey) {
    return ui[locale][key] || ui[defaultLang][key];
  };
}
