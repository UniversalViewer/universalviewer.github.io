export const uvLocaleStrings = {
  en: 'en-GB:English+(GB),cy-GB:Cymraeg,fr-FR:Français+(FR),pl-PL:Polski,sv-SE:Svenska',
  cy: 'cy-GB:Cymraeg,en-GB:English+(GB),fr-FR:Français+(FR),pl-PL:Polski,sv-SE:Svenska',
};

const uvLocales = [
  { name: 'en-GB' },
  { name: 'cy-GB' },
  { name: 'fr-FR' },
  { name: 'pl-PL' },
  { name: 'sv-SE' },
];

export function getLocalesForUV(currentLocale: string): Array<{ name: string }> {
  const sortedLocales = [...uvLocales].sort((a, b) => {
    const aMatch = a.name.startsWith(currentLocale);
    const bMatch = b.name.startsWith(currentLocale);

    if (aMatch && !bMatch) return -1;
    if (!aMatch && bMatch) return 1;
    return 0;
  });

  return sortedLocales;
}