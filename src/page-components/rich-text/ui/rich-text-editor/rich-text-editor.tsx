import {useMemo} from "react";
import {IBasePageComponent} from "@/entities/dynamic-page";
import {PageComponentError} from "@/shared/ui-kit";
import {IRichTextPageComponent} from "../../types/type";
import {RichTextEditor as Editor} from "@/features/rich-text-editor";


interface IProps {
  component: IBasePageComponent;
  onChange: (value: IBasePageComponent) => void;
}

export default function RichTextEditor(props: IProps) {
  const typedComponent = useMemo(() => {
    if (props.component.componentType !== "rich-text")
      return null;

    return props.component as IRichTextPageComponent;
  }, [props]);

  const onChange = (value: string) => {
    props.onChange({...typedComponent, text: value} as IRichTextPageComponent);
  }

  return (
    <PageComponentError component={typedComponent}>
      <Editor value={typedComponent!.text} onChange={onChange}/>
    </PageComponentError>
  )
}