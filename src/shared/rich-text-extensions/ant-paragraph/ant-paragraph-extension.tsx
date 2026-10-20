import Paragraph from "@tiptap/extension-paragraph";
import {NodeViewContent, NodeViewProps, NodeViewWrapper, ReactNodeViewRenderer} from "@tiptap/react";
import AntParagraph from "./ant-paragraph";

function AntParagraphNodeView(props: NodeViewProps) {
  return (
    <NodeViewWrapper>
      <AntParagraph textAlign={props.node.attrs.textAlign}>
        <NodeViewContent/>
      </AntParagraph>
    </NodeViewWrapper>
  );
}

export default Paragraph.extend({
  addNodeView: () => ReactNodeViewRenderer(AntParagraphNodeView)
});
