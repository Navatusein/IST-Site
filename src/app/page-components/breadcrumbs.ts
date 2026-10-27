import type {IPublicMenuItem} from "@/entities/public-menu-item";
import {getPublicMenuItemsTreeAction} from "@/entities/public-menu-item/actions/actions";
import {unwrapServerAction} from "@/shared/utilities/unwrap-server-action";
import {toPublicHref} from "@/shared/utilities/public-paths";

export interface IBreadcrumb {
  title: string;
  href?: string;
}

interface IMenuChain {
  path: string;
  items: IPublicMenuItem[];
}

function normalize(path: string): string {
  const href = toPublicHref(path.replace(/[?#].*$/, ""));
  return href == "/" ? "/" : href.replace(/\/+$/, "");
}

function getChains(items: IPublicMenuItem[], ancestors: IPublicMenuItem[] = []): IMenuChain[] {
  return items.flatMap((item) => [
    ...(item.path?.startsWith("/") ? [{path: normalize(item.path), items: [...ancestors, item]}] : []),
    ...getChains(item.children ?? [], [...ancestors, item])
  ]);
}

// Built from the navigation menu: the item of this page or of the closest page above it (news → «Новини»)
export async function getBreadcrumbs(currentPath: string, currentTitle: string): Promise<IBreadcrumb[]> {
  const current = normalize(currentPath);

  if (current == "/")
    return [];

  const menuItems = await unwrapServerAction(getPublicMenuItemsTreeAction()).catch(() => []);
  const chains = getChains(menuItems);

  const home: IBreadcrumb = {title: chains.find((chain) => chain.path == "/")?.items.at(-1)?.label ?? "Головна", href: "/"};

  const match = chains
    .filter((chain) => chain.path != "/" && (current == chain.path || current.startsWith(chain.path + "/")))
    .sort((a, b) => b.path.length - a.path.length)[0];

  if (!match)
    return [home, {title: currentTitle}];

  const isExact = match.path == current;
  const crumbs = match.items.map((item, index): IBreadcrumb => {
    const isLast = isExact && index == match.items.length - 1;
    return {title: item.label, href: !isLast && item.path?.startsWith("/") ? normalize(item.path) : undefined};
  });

  return [home, ...crumbs, ...(isExact ? [] : [{title: currentTitle}])];
}
