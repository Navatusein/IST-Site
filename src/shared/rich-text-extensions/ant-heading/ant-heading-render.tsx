import {IRichTextNodeRenderProps} from "../types";
import AntHeading from "./ant-heading";

export default function AntHeadingRender(props: IRichTextNodeRenderProps) {
  return (
    <AntHeading level={props.node.attrs?.level ?? 1} textAlign={props.node.attrs?.textAlign}>
      {props.node.content?.length ? props.children : <br/>}
    </AntHeading>
  )
}
