import {useMemo} from "react";
import {IBasePageComponent} from "@/entities/dynamic-page";
import {PageComponentError} from "@/shared/ui-kit";
import {IRichTextPageComponent} from "../../types/type";
import {RichTextEditor as Editor} from "@/features/rich-text-editor";


interface IProps {
  componentProps: IBasePageComponent;
  onChange: (value: IBasePageComponent) => void;
}

export default function RichTextEditor(props: IProps) {
  const typedComponentProps = useMemo(() => {
    if (props.componentProps.type !== "markdown-text")
      return null;

    return props.componentProps as IRichTextPageComponent;
  }, [props]);

  const onChange = (value: string) => {
    props.onChange({...typedComponentProps, text: value} as IRichTextPageComponent);
  }

  return (
    <PageComponentError message={typedComponentProps == null ? "Fail" : ""}>
      <Editor value={typedComponentProps!.text} onChange={onChange}/>
    </PageComponentError>
  )
}