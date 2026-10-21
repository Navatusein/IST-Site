import {GlobalToken} from "antd";
import {SiteLinkSourceKind} from "../types/type";

export type SiteLinkKind = SiteLinkSourceKind | "broken";

export const SITE_LINK_KIND_LABELS: Record<SiteLinkKind, string> = {
  page: "Сторінка",
  news: "Новина",
  staff: "Співробітник",
  menu: "Меню",
  broken: "Сторінки не існує",
};

export const SITE_LINK_KIND_TAG_COLORS: Record<SiteLinkKind, string> = {
  page: "cyan",
  news: "gold",
  staff: "green",
  menu: "purple",
  broken: "error",
};

export function getSiteLinkKindColors(token: GlobalToken): Record<SiteLinkKind, string> {
  return {
    page: token.cyan,
    news: token.gold,
    staff: token.green,
    menu: token.purple,
    broken: token.colorError,
  };
}
