import Heading from "@tiptap/extension-heading";
import {NodeViewContent, NodeViewProps, NodeViewWrapper, ReactNodeViewRenderer} from "@tiptap/react";
import {Typography} from "antd";

export function AntHeadingComponent(props: NodeViewProps) {
  return (
    <NodeViewWrapper>
      <Typography.Title
        level={props.node.attrs.level}
        style={{textAlign: props.node.attrs.textAlign ?? "left"}}
      >
        <NodeViewContent/>
      </Typography.Title>
    </NodeViewWrapper>
  );
}

export default Heading.extend({
  addNodeView: () => {
    return ReactNodeViewRenderer(AntHeadingComponent);
  }
})


