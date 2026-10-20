import {ReactNode} from "react";

export interface IRichTextMark {
  type: string;
  attrs?: {
    href?: string;
    target?: string | null;
    rel?: string | null;
    title?: string | null;
  };
}

export interface IRichTextNode {
  type: string;
  attrs?: {
    level?: number;
    textAlign?: "left" | "right" | "center" | null;
    start?: number;
  };
  content?: IRichTextNode[];
  text?: string;
  marks?: IRichTextMark[];
}

export interface IRichTextNodeRenderProps {
  node: IRichTextNode;
  children?: ReactNode;
}
