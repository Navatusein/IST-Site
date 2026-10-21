"use client"

import {Flex} from "antd";
import {ISiteLinksGraph} from "../../types/type";
import {getIncomingLinks, getOutgoingLinks, getSiteLinkNode} from "../../utilities/site-links-graph";
import SiteLinkRow from "../site-link-row/site-link-row";
import SiteLinksSection from "../site-links-section/site-links-section";

interface IProps {
  graph: ISiteLinksGraph;
  pageKey: string;
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
