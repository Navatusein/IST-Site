"use client";

import React, {CSSProperties} from "react";
import {ExtensionsForEditor} from "@/shared/rich-text-extensions"
import {EditorContent, useEditor} from "@tiptap/react";
import ToolBar from "../tool-bar/tool-bar";
import styles from "./rich-text-editor.module.scss";
import {Flex, Input} from "antd";
import tryCatch from "@/shared/utilities/try-catch";

interface IProps {
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  style?: CSSProperties;
}

export default function RichTextEditor(props: IProps) {
  const editor = useEditor({
    extensions: ExtensionsForEditor,
    content: tryCatch(() => JSON.parse(props.value ?? ""), null),
    onUpdate: (event) => {
      const content = JSON.stringify(event.editor.getJSON());
      props.onChange?.(content);
    },
    immediatelyRender: false,
  })

  return (
    <Flex vertical gap="small" style={{position: "relative"}}>
      <ToolBar editor={editor}/>
      <EditorContent
        editor={editor}
        className={`ist-theme ant-input-css-var ${styles.input} ${props.className}`}
        style={props.style}
      />
      <Input style={{display: "none"}}/>
    </Flex>
  )
}
