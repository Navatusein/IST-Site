import {IBasePageComponent} from "@/entities/dynamic-page";
import {Layout, theme} from "antd";
import {useMemo} from "react";
import {PageComponentError} from "@/shared/ui-kit";
import {
  headingsPlugin,
  linkPlugin,
  listsPlugin,
  markdownShortcutPlugin,
  MDXEditor,
  quotePlugin
} from "@mdxeditor/editor";
import {ITextPageComponent} from "../../types/type";

interface IProps {
  componentProps: IBasePageComponent;
  onChange: (value: IBasePageComponent) => void;
}

export default function PageComponentTextEditor(props: IProps) {
  const {token: {colorBgContainer}} = theme.useToken();

  const typedComponentProps = useMemo(() => {
    if (props.componentProps.type !== "text")
      return null;

    return props.componentProps as ITextPageComponent;
  }, [props])

  return (
    <PageComponentError message={typedComponentProps == null ? "Fail" : ""}>
      <Layout.Content style={{background: colorBgContainer}}>
        <MDXEditor
          markdown={typedComponentProps?.content ?? ""}
          onChange={(value) => {props.onChange({...typedComponentProps!, content: value} as ITextPageComponent)}}
          plugins={[headingsPlugin(), listsPlugin(), linkPlugin(), quotePlugin(), markdownShortcutPlugin()]}
        />
      </Layout.Content>
    </PageComponentError>
  )
}
