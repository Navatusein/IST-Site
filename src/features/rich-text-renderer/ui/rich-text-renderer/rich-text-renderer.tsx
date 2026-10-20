import {CSSProperties} from "react";
import tryCatch from "@/shared/utilities/try-catch";
import {IRichTextNode} from "@/shared/rich-text-extensions/types";
import {renderNode} from "../../utilities/render-rich-text";

interface IProps {
  content: string;
  className?: string;
  style?: CSSProperties;
}

export default function RichTextRenderer(props: IProps) {
  const doc: IRichTextNode | null = tryCatch(() => JSON.parse(props.content ?? ""), null);

  return (
    <div className={props.className} style={props.style}>
      {doc && renderNode(doc, 0)}
    </div>
  )
}
