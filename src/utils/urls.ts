

export function makeHref(locale: string) {
  const urlPrefix = locale === "en" ? "" : `/${locale}`;

  return function href(path: string) {
    return `${urlPrefix}${path}`;
  };
}