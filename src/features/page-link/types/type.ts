import type {IFileEntry} from "@/entities/file";

export type PageLinkType = "link" | "file" | "page" | "none";

export interface IPageLink {
  linkType: PageLinkType;
  link: string;
}

export type PageLinkFiles = Record<string, IFileEntry>;
