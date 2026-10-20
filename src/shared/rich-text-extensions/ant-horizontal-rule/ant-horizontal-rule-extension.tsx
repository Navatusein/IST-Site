import HorizontalRule from "@tiptap/extension-horizontal-rule";
import {NodeViewWrapper, ReactNodeViewRenderer} from "@tiptap/react";
import AntHorizontalRule from "./ant-horizontal-rule";

function AntHorizontalRuleNodeView() {
  return (
    <NodeViewWrapper>
      <AntHorizontalRule/>
    </NodeViewWrapper>
  );
}

export default HorizontalRule.extend({
  addNodeView: () => ReactNodeViewRenderer(AntHorizontalRuleNodeView)
});
