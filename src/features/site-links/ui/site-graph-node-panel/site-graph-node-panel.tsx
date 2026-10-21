"use client"

import {Button, Card, Divider, Flex, Tag, theme, Typography} from "antd";
import {CloseOutlined, EditOutlined, ExportOutlined} from "@ant-design/icons";
import {ISiteLinksGraph} from "../../types/type";
import {getSiteLinkNode} from "../../utilities/site-links-graph";
import {ISiteGraphNode} from "../../utilities/site-links-graph-view";
import PageLinksSections from "../page-links-sections/page-links-sections";
import SiteLinksSection from "../site-links-section/site-links-section";
import SiteLinkRow from "../site-link-row/site-link-row";
import {SITE_LINK_KIND_LABELS, SITE_LINK_KIND_TAG_COLORS} from "../../utilities/site-link-kinds";

interface IProps {
  graph: ISiteLinksGraph;
  selected: ISiteGraphNode;
  onClose: () => void;
}

export default function SiteGraphNodePanel(props: IProps) {
  const {token} = theme.useToken();

  const {selected} = props;

  const menuLinks = selected.kind == "menu" ?
    props.graph.links.filter((link) => link.source.startsWith("menu:")) : [];

  const brokenLinks = selected.kind == "broken" ?
    props.graph.links.filter((link) => link.target == null && link.path == selected.title) : [];

  return (
    <Card
      size="small"
      title={<Typography.Text strong ellipsis>{selected.title}</Typography.Text>}
      extra={<Button type="text" size="small" icon={<CloseOutlined/>} onClick={props.onClose} aria-label="Закрити"/>}
      style={{
        position: "absolute",
        top: token.padding,
        right: token.padding,
        bottom: token.padding,
        width: 380,
        maxWidth: `calc(100% - ${2 * token.padding}px)`,
        display: "flex",
        flexDirection: "column",
        boxShadow: token.boxShadowTertiary
      }}
      styles={{body: {flex: 1, minHeight: 0, overflowY: "auto", display: "flex", flexDirection: "column"}}}
    >
      <Flex gap="small" align="center" style={{minWidth: 0}}>
        <Tag color={SITE_LINK_KIND_TAG_COLORS[selected.kind]} style={{marginInlineEnd: 0}}>{SITE_LINK_KIND_LABELS[selected.kind]}</Tag>
        {selected.node?.path && <Typography.Text type="secondary" ellipsis>{selected.node.path}</Typography.Text>}
      </Flex>
      {selected.kind != "broken" && (
        <Flex gap="small" wrap style={{marginTop: token.margin}}>
          {selected.node?.path && (
            <Button icon={<ExportOutlined/>} href={selected.node.path} target="_blank">Відкрити</Button>
          )}
          <Button icon={<EditOutlined/>} href={selected.node?.editUrl ?? "/admin/public-menu"}>
            {selected.node ? "Редагувати контент" : "Редагувати меню"}
          </Button>
        </Flex>
      )}
      <Divider style={{margin: `${token.margin}px 0`}}/>
      {selected.node && <PageLinksSections graph={props.graph} pageKey={selected.node.key}/>}
      {selected.kind == "menu" && (
        <SiteLinksSection title="Пункти меню ведуть на" count={menuLinks.length} empty="Пункти меню не ведуть на сторінки сайту">
          {menuLinks.map((link) => (
            <SiteLinkRow
              key={`${link.source}-${link.path}`}
              node={link.target ? getSiteLinkNode(props.graph, link.target) : undefined}
              details={`${getSiteLinkNode(props.graph, link.source)?.title} → ${link.path}`}
              isBroken={link.target == null}
              editNode={getSiteLinkNode(props.graph, link.source)}
            />
          ))}
        </SiteLinksSection>
      )}
      {selected.kind == "broken" && (
        <SiteLinksSection title="Посилання на неї є на сторінках" count={brokenLinks.length} empty="Посилань немає">
          {brokenLinks.map((link) => (
            <SiteLinkRow
              key={link.source}
              node={getSiteLinkNode(props.graph, link.source)}
              details={link.href}
              componentId={link.componentId}
              danger
            />
          ))}
        </SiteLinksSection>
      )}
    </Card>
  )
}
