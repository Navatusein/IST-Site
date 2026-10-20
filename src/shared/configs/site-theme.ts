export const SITE_THEMES = ["light", "dark"] as const;

export type SiteTheme = typeof SITE_THEMES[number];

export const THEME_COOKIE_NAME = "theme";

export function getThemeCssVarKey(theme: SiteTheme): string {
  return `ist-theme-${theme}`;
}

export function resolveSiteTheme(value: string | undefined): SiteTheme {
  return value == "dark" ? "dark" : "light";
}
