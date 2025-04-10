"use client"

import {useMemo} from "react";
import {PageComponentError} from "@/shared/ui-kit";
import {ITextPageComponent} from "../../types/type";
import {
  headingsPlugin,
  linkPlugin,
  listsPlugin,
  markdownShortcutPlugin,
  MDXEditor,
  quotePlugin
} from "@mdxeditor/editor";
import {IBasePageComponent} from "@/entities/dynamic-page";
import {Layout, theme} from "antd";

interface IProps {
  propsClass: IBasePageComponent;
  onChange: (value: IBasePageComponent) => void;
}

export default function TextPageComponentEditor(props: IProps) {
  const {token: {colorBgContainer}} = theme.useToken();

  const propsClass = useMemo(() => {
    if (props.propsClass.type !== "text")
      return null;

    return props.propsClass as ITextPageComponent;
  }, [props])

  return (
    <PageComponentError message={propsClass == null ? "Fail" : ""}>
      <Layout.Content style={{background: colorBgContainer}}>
        <MDXEditor
          markdown={propsClass?.content ?? ""}
          onChange={(value) => {props.onChange({...propsClass!, content: value} as ITextPageComponent)}}
          plugins={[headingsPlugin(), listsPlugin(), linkPlugin(), quotePlugin(), markdownShortcutPlugin()]}
        />
      </Layout.Content>
    </PageComponentError>
  )
}
