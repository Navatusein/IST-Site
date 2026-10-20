import Heading from "@tiptap/extension-heading";
import {NodeViewContent, NodeViewProps, NodeViewWrapper, ReactNodeViewRenderer} from "@tiptap/react";
import AntHeading from "./ant-heading";

function AntHeadingNodeView(props: NodeViewProps) {
  return (
    <NodeViewWrapper>
      <AntHeading level={props.node.attrs.level} textAlign={props.node.attrs.textAlign}>
        <NodeViewContent/>
      </AntHeading>
    </NodeViewWrapper>
  );
}

export default Heading.extend({
  addNodeView: () => ReactNodeViewRenderer(AntHeadingNodeView)
});
