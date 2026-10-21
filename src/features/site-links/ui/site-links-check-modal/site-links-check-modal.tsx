"use client"

import {Empty, Flex, Modal, Tabs, Typography} from "antd";
import {ISiteLinksGraph} from "../../types/type";
import {getBrokenLinks, getSiteLinkNode, getUnlinkedPages} from "../../utilities/site-links-graph";
import SiteLinkRow from "../site-link-row/site-link-row";

interface IProps {
  graph: ISiteLinksGraph;
  open: boolean;
  onClose: () => void;
}

export default function SiteLinksCheckModal(props: IProps) {
  const brokenLinks = getBrokenLinks(props.graph);
  const unlinkedPages = getUnlinkedPages(props.graph);

  return (
    <Modal open={props.open} onCancel={props.onClose} footer={null} title="Перевірка посилань" width={640} destroyOnHidden>
      <Tabs
        items={[
          {
            key: "broken",
            label: `Биті посилання (${brokenLinks.length})`,
            children: (
              <Flex vertical gap="small">
                <Typography.Text type="secondary">
                  Посилання на сторінки, яких немає на сайті, наприклад після зміни шляху сторінки
                </Typography.Text>
                {brokenLinks.length == 0 ? <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Битих посилань немає"/> : (
                  <Flex vertical gap={4}>
                    {brokenLinks.map((link) => (
                      <SiteLinkRow
                        key={`${link.source}-${link.path}`}
                        node={getSiteLinkNode(props.graph, link.source)}
                        details={`Веде на ${link.path}`}
                        componentId={link.componentId}
                        danger
                      />
                    ))}
                  </Flex>
                )}
              </Flex>
            )
          },
          {
            key: "unlinked",
            label: `Без посилань (${unlinkedPages.length})`,
            children: (
              <Flex vertical gap="small">
                <Typography.Text type="secondary">
                  Динамічні сторінки, на які не веде жодне посилання і яких немає в меню: відвідувачі їх не знайдуть
                </Typography.Text>
                {unlinkedPages.length == 0 ? <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Таких сторінок немає"/> : (
                  <Flex vertical gap={4}>
                    {unlinkedPages.map((node) => (
                      <SiteLinkRow key={node.key} node={node} details={node.path}/>
                    ))}
                  </Flex>
                )}
              </Flex>
            )
          },
        ]}
      />
    </Modal>
  )
}
