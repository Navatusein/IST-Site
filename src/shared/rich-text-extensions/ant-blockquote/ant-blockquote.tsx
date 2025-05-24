import Blockquote from "@tiptap/extension-blockquote";
import {NodeViewContent, NodeViewProps, NodeViewWrapper, ReactNodeViewRenderer} from "@tiptap/react";
import {theme, Typography} from "antd";

export function AntHeadingComponent(props: NodeViewProps) {
  const {token: {colorBorderSecondary, paddingLG, colorTextSecondary}} = theme.useToken();

  return (
    <NodeViewWrapper>
      <Typography.Paragraph
        italic
        style={{
          borderLeft: `4px solid ${colorBorderSecondary}`,
          paddingLeft: paddingLG,
          color: colorTextSecondary
        }}
      >
        <NodeViewContent/>
      </Typography.Paragraph>
    </NodeViewWrapper>
  );
}

export default Blockquote.extend({
  addNodeView: () => {
    return ReactNodeViewRenderer(AntHeadingComponent);
  }
})