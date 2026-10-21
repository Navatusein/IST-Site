export type SiteLinkSourceKind = "page" | "news" | "staff" | "menu";

export interface ISiteLinkNode {
  key: string;
  kind: SiteLinkSourceKind;
  title: string;
  path?: string;
  editUrl: string;
}

export interface ISiteLink {
  source: string;
  href: string;
  path: string;
  target: string | null;
  componentId?: string;
}

export interface ISiteLinksGraph {
  nodes: ISiteLinkNode[];
  links: ISiteLink[];
}

export interface IBrokenPageLink {
  href: string;
  path: string;
  componentId?: string;
}
