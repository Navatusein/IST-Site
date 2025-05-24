import HorizontalRule from "@tiptap/extension-horizontal-rule";
import {NodeViewProps, NodeViewWrapper, ReactNodeViewRenderer} from "@tiptap/react";
import {Divider} from "antd";

export function AntHeadingComponent(props: NodeViewProps) {
  return (
    <NodeViewWrapper>
      <Divider />
    </NodeViewWrapper>
  );
}

export default HorizontalRule.extend({
  addNodeView: () => {
    return ReactNodeViewRenderer(AntHeadingComponent);
  }
})