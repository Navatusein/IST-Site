import {useMemo} from "react";
import {IBasePageComponent} from "@/entities/dynamic-page";
import {PageComponentError} from "@/shared/ui-kit";
import {IMarkdownTextPageComponent} from "../../types/type";
import {RichTextEditor} from "../../../../features/rich-text-editor";

interface IProps {
  componentProps: IBasePageComponent;
  onChange: (value: IBasePageComponent) => void;
}

export default function MarkdownTextEditor(props: IProps) {
  const typedComponentProps = useMemo(() => {
    if (props.componentProps.type !== "markdown-text")
      return null;

    return props.componentProps as IMarkdownTextPageComponent;
  }, [props]);

  const onChange = (value: string) => {
    props.onChange({...typedComponentProps, text: value} as IMarkdownTextPageComponent);
  }

  return (
    <PageComponentError message={typedComponentProps == null ? "Fail" : ""}>
      <RichTextEditor value={typedComponentProps!.text} onChange={onChange}/>
    </PageComponentError>
  )
}