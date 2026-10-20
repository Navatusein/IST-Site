import Blockquote from "@tiptap/extension-blockquote";
import {NodeViewContent, NodeViewWrapper, ReactNodeViewRenderer} from "@tiptap/react";
import AntBlockquote from "./ant-blockquote";

function AntBlockquoteNodeView() {
  return (
    <NodeViewWrapper>
      <AntBlockquote>
        <NodeViewContent/>
      </AntBlockquote>
    </NodeViewWrapper>
  );
}

export default Blockquote.extend({
  addNodeView: () => ReactNodeViewRenderer(AntBlockquoteNodeView)
});
