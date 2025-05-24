import Extensions from "@/shared/rich-text-extensions"
import {EditorContent, useEditor} from "@tiptap/react";

interface IProps {
  content: string;
}

export default function RichTextRenderer(props: IProps) {
  const editor = useEditor({
    editable: false,
    extensions: Extensions,
    content: JSON.parse(props.content ?? ""),
    immediatelyRender: false,
  }, [props.content])

  return (
    <EditorContent editor={editor} readOnly/>
  )
}
