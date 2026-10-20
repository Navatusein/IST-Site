import {IRichTextNodeRenderProps} from "../types";
import AntBlockquote from "./ant-blockquote";

export default function AntBlockquoteRender(props: IRichTextNodeRenderProps) {
  return <AntBlockquote>{props.children}</AntBlockquote>;
}
