import type {RevisionCollection} from "@/shared/types/revision";
import type {UserPermissionType} from "@/shared/configs/permissions-config";

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

export interface IPageEditor {
  href: string;
  permission: UserPermissionType;
}

const NOT_EDITABLE_SEGMENTS = ["file", "files", "sign-in", "test", "not-found", "admin", "api"];

// The block editor of the page at a public address; `back` brings the editor's back button here
export function getPublicPageEditor(pathname: string): IPageEditor | null {
  let segments: string[];

  try {
    segments = pathname.split("/").filter(Boolean).map(decodeURIComponent);
  }
  catch {
    return null;
  }

  if (NOT_EDITABLE_SEGMENTS.includes(segments[0]))
    return null;

  const back = `?back=${encodeURIComponent(pathname)}`;
  const editPath = (type: string, path: string) => `/admin/edit-page/${type}/${path.split("/").map(encodeURIComponent).join("/")}${back}`;

  if (segments[0] == "news" && segments.length == 2)
    return {href: editPath("news", segments[1]), permission: "edit-news"};

  if (segments[0] == "department-staff" && segments.length == 2)
    return {href: editPath("department-staff", segments[1]), permission: "edit-department-staff"};

  return {href: editPath("dynamic-page", segments.length ? segments.join("/") : HOME_PAGE_PATH), permission: "edit-dynamic-pages"};
}

// Only a path on this site, so a crafted link cannot send the editor elsewhere
export function getSafeBackPath(value: string | null): string | null {
  return value && value.startsWith("/") && !value.startsWith("//") && !value.startsWith("/\\") ? value : null;
}
