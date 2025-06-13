"use client"

import {ExtensionsForRender} from "@/shared/rich-text-extensions"
import {EditorContent, useEditor} from "@tiptap/react";

interface IProps {
  content: string;
}

export default function RichTextRenderer(props: IProps) {
  const editor = useEditor({
    editable: false,
    extensions: ExtensionsForRender,
    content: JSON.parse(props.content ?? ""),
    immediatelyRender: false,
    shouldRerenderOnTransaction: false,
  }, [props.content])

  return (
    <EditorContent editor={editor}/>
  )
}
