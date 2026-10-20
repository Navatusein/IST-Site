import {getFileViewUrl} from "@/shared/utilities/file-urls";
import {IPageLink} from "../types/type";

export function getPageLinkHref(link: IPageLink): string {
  return link.linkType == "file" ? getFileViewUrl(link.link) : link.link;
}

export function isExternalPageLink(link: IPageLink): boolean {
  return link.linkType == "link" && (/^(https?:)?\/\//i.test(link.link) || /^(mailto|tel):/i.test(link.link));
}

export function getPageLinkFileSlugs(links: (IPageLink | null | undefined)[]): string[] {
  return [...new Set(
    links
      .filter((link): link is IPageLink => link?.linkType == "file" && !!link.link)
      .map((link) => link.link)
  )];
}
