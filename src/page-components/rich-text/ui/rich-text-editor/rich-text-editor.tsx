import {RichTextEditor as Editor} from "@/features/rich-text-editor";
import {IPageComponentEditorProps} from "@/entities/dynamic-page/model";
import {IRichTextPageComponent} from "../../types/type";

export default function RichTextEditor(props: IPageComponentEditorProps<IRichTextPageComponent>) {
  const onChange = (value: string) => {
    props.onChange({...props.component, text: value});
  }

  return (
    <Editor value={props.component.text} onChange={onChange}/>
  )
}
