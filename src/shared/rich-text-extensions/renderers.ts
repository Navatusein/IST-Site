import {ComponentType} from "react";
import {IRichTextNodeRenderProps} from "./types";
import AntParagraphRender from "./ant-paragraph/ant-paragraph-render";
import AntHeadingRender from "./ant-heading/ant-heading-render";
import AntBlockquoteRender from "./ant-blockquote/ant-blockquote-render";
import AntHorizontalRuleRender from "./ant-horizontal-rule/ant-horizontal-rule-render";

export const RICH_TEXT_NODE_RENDERERS: Record<string, ComponentType<IRichTextNodeRenderProps>> = {
  paragraph: AntParagraphRender,
  heading: AntHeadingRender,
  blockquote: AntBlockquoteRender,
  horizontalRule: AntHorizontalRuleRender,
};
