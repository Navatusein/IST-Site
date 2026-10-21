"use client"

import {useEffect, useMemo, useRef, useState} from "react";
import ForceGraph, {ForceGraphMethods, LinkObject, NodeObject} from "react-force-graph-2d";
import {Button, Checkbox, Flex, Select, Tag, theme, Tooltip} from "antd";
import {ExpandOutlined} from "@ant-design/icons";
import {ISiteLinksGraph} from "../../types/type";
import {
  buildSiteGraphView,
  ISiteGraphFilter,
  ISiteGraphLink,
  ISiteGraphNode,
  SiteGraphNodeKind
} from "../../utilities/site-links-graph-view";
import SiteGraphNodePanel from "../site-graph-node-panel/site-graph-node-panel";
import {getSiteLinkKindColors, SITE_LINK_KIND_LABELS, SITE_LINK_KIND_TAG_COLORS} from "../../utilities/site-link-kinds";

interface IProps {
  graph: ISiteLinksGraph;
}

type GraphNode = NodeObject<ISiteGraphNode>;
type GraphLink = LinkObject<ISiteGraphNode, ISiteGraphLink>;

const getEndId = (end: unknown): string => end != null && typeof end == "object" ? String((end as {id?: unknown}).id) : String(end);

const getRadius = (node: ISiteGraphNode) => 4 + Math.sqrt(node.incoming) * 2;

export default function SiteLinksGraph(props: IProps) {
  const {token} = theme.useToken();

  const kindColors = getSiteLinkKindColors(token);

  const graphRef = useRef<ForceGraphMethods<GraphNode, GraphLink>>(undefined);
  const containerRef = useRef<HTMLDivElement>(null);
  const positionsRef = useRef(new Map<string, {x?: number, y?: number}>());

  const [size, setSize] = useState({width: 0, height: 0});
  const [filter, setFilter] = useState<ISiteGraphFilter>({news: false, staff: false, menu: true});
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  useEffect(() => {
    const element = containerRef.current;

    if (!element)
      return;

    const observer = new ResizeObserver(([entry]) => setSize({width: entry.contentRect.width, height: entry.contentRect.height}));
    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  const graphData = useMemo(() => {
    const view = buildSiteGraphView(props.graph, filter);

    return {
      nodes: view.nodes.map((node): GraphNode => ({...node, ...positionsRef.current.get(node.id)})),
      links: view.links.map((link): GraphLink => ({...link}))
    };
  }, [props.graph, filter]);

  useEffect(() => {
    if (selectedId && !graphData.nodes.some((node) => node.id == selectedId))
      setSelectedId(null);
  }, [graphData]);

  const focusId = selectedId ?? hoveredId;

  const neighbors = useMemo(() => {
    const result = new Set<string>();

    if (!focusId)
      return result;

    for (const link of graphData.links) {
      const source = getEndId(link.source);
      const target = getEndId(link.target);

      if (source == focusId)
        result.add(target);

      if (target == focusId)
        result.add(source);
    }

    return result;
  }, [graphData, focusId]);

  const isFaded = (id: string) => focusId != null && id != focusId && !neighbors.has(id);

  const selected = graphData.nodes.find((node) => node.id == selectedId);

  const focusNode = (id: string) => {
    const node = graphData.nodes.find((item) => item.id == id);
    setSelectedId(id);

    if (node?.x != null && node.y != null) {
      graphRef.current?.centerAt(node.x, node.y, 600);
      graphRef.current?.zoom(3, 600);
    }
  }

  const paintNode = (node: GraphNode, context: CanvasRenderingContext2D, globalScale: number) => {
    const radius = getRadius(node);
    const id = String(node.id);
    const isFocused = id == focusId;

    context.globalAlpha = isFaded(id) ? 0.15 : 1;

    context.beginPath();
    context.arc(node.x!, node.y!, radius, 0, 2 * Math.PI);
    context.fillStyle = kindColors[node.kind];
    context.fill();

    if (isFocused) {
      context.lineWidth = 2 / globalScale;
      context.strokeStyle = token.colorText;
      context.stroke();
    }

    if (globalScale >= 1.6 || isFocused || neighbors.has(id)) {
      const fontSize = 12 / globalScale;
      context.font = `${isFocused ? 600 : 400} ${fontSize}px ${token.fontFamily}`;
      context.textAlign = "center";
      context.textBaseline = "top";
      context.fillStyle = token.colorText;
      context.fillText(node.title.length > 40 ? node.title.slice(0, 39) + "…" : node.title, node.x!, node.y! + radius + 2 / globalScale);
    }

    context.globalAlpha = 1;
  }

  const paintPointerArea = (node: GraphNode, color: string, context: CanvasRenderingContext2D) => {
    context.fillStyle = color;
    context.beginPath();
    context.arc(node.x!, node.y!, getRadius(node) + 2, 0, 2 * Math.PI);
    context.fill();
  }

  const isLinkFocused = (link: GraphLink) => focusId != null && (getEndId(link.source) == focusId || getEndId(link.target) == focusId);

  const legendKinds: SiteGraphNodeKind[] = ["page", ...(filter.news ? ["news" as const] : []), ...(filter.staff ? ["staff" as const] : []), ...(filter.menu ? ["menu" as const] : []), "broken"];

  return (
    <Flex vertical gap="middle">
      <Flex gap="middle" wrap align="center">
        <Select
          showSearch
          allowClear
          placeholder="Знайти сторінку"
          style={{width: 280}}
          value={selectedId}
          optionFilterProp="label"
          options={graphData.nodes.map((node) => ({value: String(node.id), label: node.title}))}
          onChange={(value) => value ? focusNode(value) : setSelectedId(null)}
        />
        <Checkbox checked={filter.menu} onChange={(event) => setFilter({...filter, menu: event.target.checked})}>Меню</Checkbox>
        <Checkbox checked={filter.news} onChange={(event) => setFilter({...filter, news: event.target.checked})}>Новини</Checkbox>
        <Checkbox checked={filter.staff} onChange={(event) => setFilter({...filter, staff: event.target.checked})}>Співробітники</Checkbox>
        <Tooltip title="Показати весь граф">
          <Button icon={<ExpandOutlined/>} onClick={() => graphRef.current?.zoomToFit(400, 40)}>Вмістити</Button>
        </Tooltip>
        <Flex gap={4} wrap style={{marginLeft: "auto"}}>
          {legendKinds.map((kind) => <Tag key={kind} color={SITE_LINK_KIND_TAG_COLORS[kind]} style={{marginInlineEnd: 0}}>{SITE_LINK_KIND_LABELS[kind]}</Tag>)}
        </Flex>
      </Flex>
      <div
        ref={containerRef}
        style={{
          position: "relative",
          height: "calc(100vh - 340px)",
          minHeight: 400,
          border: `1px solid ${token.colorBorderSecondary}`,
          borderRadius: token.borderRadiusLG,
          overflow: "hidden"
        }}
      >
        {size.width > 0 && (
          <ForceGraph<ISiteGraphNode, ISiteGraphLink>
            ref={graphRef}
            width={size.width}
            height={size.height}
            graphData={graphData}
            backgroundColor={token.colorBgContainer}
            nodeCanvasObject={paintNode}
            nodePointerAreaPaint={paintPointerArea}
            nodeLabel={() => ""}
            linkColor={(link) => isLinkFocused(link) ? token.colorPrimary : token.colorBorder}
            linkWidth={(link) => isLinkFocused(link) ? 1.5 : 0.7}
            linkDirectionalArrowLength={4}
            linkDirectionalArrowRelPos={1}
            cooldownTicks={150}
            onEngineStop={() => {
              for (const node of graphData.nodes)
                positionsRef.current.set(String(node.id), {x: node.x, y: node.y});
            }}
            onNodeClick={(node) => setSelectedId(String(node.id))}
            onNodeHover={(node) => {
              setHoveredId(node ? String(node.id) : null);

              if (containerRef.current)
                containerRef.current.style.cursor = node ? "pointer" : "";
            }}
            onBackgroundClick={() => setSelectedId(null)}
          />
        )}
        {selected && (
          <SiteGraphNodePanel
            graph={props.graph}
            selected={selected}
            onClose={() => setSelectedId(null)}
          />
        )}
      </div>
    </Flex>
  )
}
