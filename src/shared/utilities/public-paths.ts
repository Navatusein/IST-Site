import type {RevisionCollection} from "@/shared/types/revision";

export const HOME_PAGE_PATH = "home";

const PUBLIC_PATH_PREFIXES: Partial<Record<RevisionCollection, string>> = {
  "dynamic-pages": "",
  "news": "/news",
  "department-staff": "/department-staff"
};

// Menu items and links may still point to /home
export function toPublicHref(href: string): string {
  return /^\/home\/?$/.test(href) ? "/" : href;
}

export function getDynamicPagePublicPath(path: string): string {
  return path == HOME_PAGE_PATH ? "/" : `/${path}`;
}

export function getRecordPublicPath(collection: RevisionCollection, path: string): string | null {
  const prefix = PUBLIC_PATH_PREFIXES[collection];

  if (prefix == null)
    return null;

  return prefix == "" ? getDynamicPagePublicPath(path) : `${prefix}/${path}`;
}
