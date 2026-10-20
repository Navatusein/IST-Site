import {RichTextRenderer} from "@/features/rich-text-renderer";
import {IPageComponentViewProps} from "@/entities/dynamic-page/model";
import {IRichTextPageComponent} from "../../types/type";

export default function RichText(props: IPageComponentViewProps<IRichTextPageComponent>) {
  return (
    <RichTextRenderer content={props.component.text}/>
  )
}
