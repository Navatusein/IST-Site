import {ISiteLinkNode, ISiteLinksGraph, SiteLinkSourceKind} from "../types/type";

export type SiteGraphNodeKind = SiteLinkSourceKind | "broken";

export interface ISiteGraphNode {
  id: string;
  kind: SiteGraphNodeKind;
  title: string;
  node?: ISiteLinkNode;
  incoming: number;
  outgoing: number;
}

export interface ISiteGraphLink {
  source: string;
  target: string;
}

export interface ISiteGraphFilter {
  news: boolean;
  staff: boolean;
  menu: boolean;
}

export const MENU_GRAPH_NODE_ID = "menu";
const BROKEN_PREFIX = "broken:";

export function buildSiteGraphView(graph: ISiteLinksGraph, filter: ISiteGraphFilter): {nodes: ISiteGraphNode[], links: ISiteGraphLink[]} {
  const nodes = new Map<string, ISiteGraphNode>();

  const add = (node: Omit<ISiteGraphNode, "incoming" | "outgoing">) => {
    if (!nodes.has(node.id))
      nodes.set(node.id, {...node, incoming: 0, outgoing: 0});
  }

  for (const node of graph.nodes) {
    if (node.kind == "page" || (node.kind == "news" && filter.news) || (node.kind == "staff" && filter.staff))
      add({id: node.key, kind: node.kind, title: node.title, node});
  }

  if (filter.menu && graph.nodes.some((node) => node.kind == "menu"))
    add({id: MENU_GRAPH_NODE_ID, kind: "menu", title: "Меню"});

  const links = new Map<string, ISiteGraphLink>();

  for (const link of graph.links) {
    const source = link.source.startsWith("menu:") ? MENU_GRAPH_NODE_ID : link.source;

    if (!nodes.has(source))
      continue;

    const target = link.target ?? BROKEN_PREFIX + link.path;

    if (!link.target)
      add({id: target, kind: "broken", title: link.path});

    if (!nodes.has(target))
      continue;

    links.set(`${source} ${target}`, {source, target});
  }

  for (const link of links.values()) {
    nodes.get(link.source)!.outgoing++;
    nodes.get(link.target)!.incoming++;
  }

  return {nodes: [...nodes.values()], links: [...links.values()]};
}
