import cy from './cy';
import en from './en';

export const defaultLang = 'en';
export const ui = { en, cy } as const;

export type Lang = keyof typeof ui;
export type TranslationKey = keyof typeof ui[typeof defaultLang];
