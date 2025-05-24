import HorizontalRule from "@tiptap/extension-horizontal-rule";
import {NodeViewContent, NodeViewProps, NodeViewWrapper, ReactNodeViewRenderer} from "@tiptap/react";
import {Divider, Typography} from "antd";

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