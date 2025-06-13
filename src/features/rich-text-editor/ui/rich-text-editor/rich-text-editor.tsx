"use client";

import React from "react";
import {ExtensionsForEditor} from "@/shared/rich-text-extensions"
import {EditorContent, useEditor} from "@tiptap/react";
import ToolBar from "../tool-bar/tool-bar";
import styles from "./rich-text-editor.module.scss";
import {Flex, Input} from "antd";

interface IProps {
  value?: string;
  onChange?: (value: string) => void;
}

export default function RichTextEditor(props: IProps) {
  const editor = useEditor({
    extensions: ExtensionsForEditor,
    content: JSON.parse(props.value ?? ""),
    onUpdate: (event) => {
      const content = JSON.stringify(event.editor.getJSON());
      props.onChange?.(content);
    },
    immediatelyRender: false,
  })

  return (
    <Flex vertical gap="small">
      <ToolBar editor={editor}/>
      <EditorContent
        editor={editor}
        className={`ist-theme ant-input-css-var ${styles.input}`}
      />
      <Input style={{display: "none"}}/>
    </Flex>
  )
}
