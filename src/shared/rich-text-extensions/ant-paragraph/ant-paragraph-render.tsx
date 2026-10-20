import {IRichTextNodeRenderProps} from "../types";
import AntParagraph from "./ant-paragraph";

export default function AntParagraphRender(props: IRichTextNodeRenderProps) {
  return (
    <AntParagraph textAlign={props.node.attrs?.textAlign}>
      {props.node.content?.length ? props.children : <br/>}
    </AntParagraph>
  )
}
