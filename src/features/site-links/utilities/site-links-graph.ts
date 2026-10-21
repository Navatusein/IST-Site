import {ISiteLink, ISiteLinkNode, ISiteLinksGraph} from "../types/type";
import {IEntityLink, normalizeSitePath} from "./extract-links";

export interface ISiteLinkSource {
  node: ISiteLinkNode;
  links: IEntityLink[];
}

export const HOME_PATH = "/home";

export function buildSiteLinksGraph(sources: ISiteLinkSource[], publicUrl?: string): ISiteLinksGraph {
  const nodes = sources.map((source) => source.node);
  const pageKeys = new Set(nodes.filter((node) => node.kind != "menu").map((node) => node.key));

  const links: ISiteLink[] = sources.flatMap(({node, links}) => {
    const seen = new Set<string>();

    return links.flatMap(({href, componentId}) => {
      const path = normalizeSitePath(href, publicUrl);

      if (path == null || path == node.key || seen.has(path))
        return [];

      seen.add(path);

      return [{source: node.key, href, path, target: pageKeys.has(path) ? path : null, componentId}];
    });
  });

  return {nodes, links};
}

export function getSiteLinkEditUrl(node: ISiteLinkNode, componentId?: string): string {
  return componentId && node.kind != "menu" ? `${node.editUrl}?block=${encodeURIComponent(componentId)}` : node.editUrl;
}

export function getSiteLinkNode(graph: ISiteLinksGraph, key: string): ISiteLinkNode | undefined {
  return graph.nodes.find((node) => node.key == key);
}

export function getIncomingLinkCounts(graph: ISiteLinksGraph): Map<string, number> {
  const counts = new Map<string, number>();

  for (const link of graph.links) {
    if (link.target)
      counts.set(link.target, (counts.get(link.target) ?? 0) + 1);
  }

  return counts;
}

export function getIncomingLinks(graph: ISiteLinksGraph, key: string): ISiteLink[] {
  return graph.links.filter((link) => link.target == key);
}

export function getOutgoingLinks(graph: ISiteLinksGraph, key: string): ISiteLink[] {
  return graph.links.filter((link) => link.source == key);
}

export function getBrokenLinks(graph: ISiteLinksGraph): ISiteLink[] {
  return graph.links.filter((link) => link.target == null);
}

export function getUnlinkedPages(graph: ISiteLinksGraph): ISiteLinkNode[] {
  const counts = getIncomingLinkCounts(graph);
  return graph.nodes.filter((node) => node.kind == "page" && node.key != HOME_PATH && !counts.get(node.key));
}
