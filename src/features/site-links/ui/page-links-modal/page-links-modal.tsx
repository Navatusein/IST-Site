"use client"

import {Modal} from "antd";
import {ISiteLinksGraph} from "../../types/type";
import {getSiteLinkNode} from "../../utilities/site-links-graph";
import PageLinksSections from "../page-links-sections/page-links-sections";

interface IProps {
  graph: ISiteLinksGraph;
  pageKey: string | null;
  onClose: () => void;
}

export default function PageLinksModal(props: IProps) {
  const node = props.pageKey ? getSiteLinkNode(props.graph, props.pageKey) : undefined;

  return (
    <Modal
      open={props.pageKey != null}
      onCancel={props.onClose}
      footer={null}
      title={`Посилання: ${node?.title ?? props.pageKey}`}
      width={640}
      destroyOnHidden
    >
      {props.pageKey && <PageLinksSections graph={props.graph} pageKey={props.pageKey}/>}
    </Modal>
  )
}
