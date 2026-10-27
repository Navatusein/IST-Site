import {IPublicMenuItem} from "@/entities/public-menu-item";

function normalizePath(path: string): string {
  const trimmed = path.replace(/[?#].*$/, "").replace(/\/+$/, "");
  return trimmed == "" ? "/home" : trimmed;
}

function flatten(items: IPublicMenuItem[]): IPublicMenuItem[] {
  return items.flatMap((item) => [item, ...flatten(item.children ?? [])]);
}

// The longest matching path wins, so a news article selects «Новини»
export function getSelectedMenuKeys(menuItems: IPublicMenuItem[], pathname: string): string[] {
  const current = normalizePath(pathname);

  const matches = flatten(menuItems)
    .filter((item) => item.path?.startsWith("/"))
    .map((item) => ({key: String(item._id), path: normalizePath(item.path!)}))
    .filter(({path}) => current == path || current.startsWith(path + "/"))
    .sort((a, b) => b.path.length - a.path.length);

  return matches.length ? [matches[0].key] : [];
}
