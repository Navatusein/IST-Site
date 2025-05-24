import Paragraph from "@tiptap/extension-paragraph";
import {NodeViewContent, NodeViewProps, NodeViewWrapper, ReactNodeViewRenderer} from "@tiptap/react";
import {Typography} from "antd";
import styles from "./ant-paragraph.module.scss"

export function AntParagraphComponent(props: NodeViewProps) {
  return (
    <NodeViewWrapper>
      <Typography.Paragraph className={styles.paragraph}>
        <NodeViewContent/>
      </Typography.Paragraph>
    </NodeViewWrapper>
  );
}

export default Paragraph.extend({
  addNodeView: () => {
    return ReactNodeViewRenderer(AntParagraphComponent);
  }
})