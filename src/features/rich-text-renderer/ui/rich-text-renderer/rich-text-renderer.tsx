"use client"

import {ExtensionsForRender} from "@/shared/rich-text-extensions"
import {EditorContent, useEditor} from "@tiptap/react";
import {CSSProperties} from "react";
import tryCatch from "@/shared/utilities/try-catch";

interface IProps {
  content: string;
  className?: string;
  style?: CSSProperties;
}

export default function RichTextRenderer(props: IProps) {
  const editor = useEditor({
    editable: false,
    extensions: ExtensionsForRender,
    content: tryCatch(() => JSON.parse(props.content ?? ""), null),
    immediatelyRender: false,
    shouldRerenderOnTransaction: false,
  }, [props.content])

  return (
    <EditorContent editor={editor} className={props.className} style={props.style}/>
  )
}
