"use client"

import {ReactNode} from "react";
import {Empty, Flex, Typography} from "antd";
import {ISiteLinksGraph} from "../../types/type";
import {getIncomingLinks, getOutgoingLinks, getSiteLinkNode} from "../../utilities/site-links-graph";
import SiteLinkRow from "../site-link-row/site-link-row";

interface IProps {
  graph: ISiteLinksGraph;
  pageKey: string;
}

export function SiteLinksSection(props: {title: string, count: number, empty: string, children: ReactNode}) {
  return (
    <Flex vertical gap="small">
      <Typography.Text strong>{props.title} ({props.count})</Typography.Text>
      {props.count == 0 ? <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={props.empty} style={{margin: 0}}/> : (
        <Flex vertical gap={4}>
          {props.children}
        </Flex>
      )}
    </Flex>
  )
}

export default function PageLinksSections(props: IProps) {
  const node = getSiteLinkNode(props.graph, props.pageKey);
  const incoming = getIncomingLinks(props.graph, props.pageKey);
  const outgoing = getOutgoingLinks(props.graph, props.pageKey);

  return (
    <Flex vertical gap="large">
      <SiteLinksSection title="На цю сторінку посилаються" count={incoming.length} empty="Жодна сторінка не посилається сюди, і її немає в меню">
        {incoming.map((link) => (
          <SiteLinkRow key={link.source} node={getSiteLinkNode(props.graph, link.source)} details={link.href} componentId={link.componentId}/>
        ))}
      </SiteLinksSection>
      <SiteLinksSection title="Ця сторінка посилається на" count={outgoing.length} empty="На сторінці немає посилань на інші сторінки сайту">
        {outgoing.map((link) => (
          <SiteLinkRow
            key={link.path}
            node={link.target ? getSiteLinkNode(props.graph, link.target) : undefined}
            details={link.target ? link.href : link.path}
            isBroken={link.target == null}
            editNode={link.target ? undefined : node}
            componentId={link.target ? undefined : link.componentId}
          />
        ))}
      </SiteLinksSection>
    </Flex>
  )
}
