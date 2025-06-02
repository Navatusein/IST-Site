import {useMemo} from "react";
import {IBasePageComponent} from "@/entities/dynamic-page";
import {PageComponentError} from "@/shared/ui-kit";
import RichTextEditor from "@/page-components/rich-text/ui/rich-text-editor/rich-text-editor";
import {IRichTextPageComponent} from "../../types/type";
import {RichTextRenderer} from "../../../../features/rich-text-renderer";

interface IProps {
  componentProps: IBasePageComponent;
}

export default function RichText(props: IProps) {
  const typedComponentProps = useMemo(() => {
    if (props.componentProps.type !== "rich-text")
      return null;

    return props.componentProps as IRichTextPageComponent;
  }, [props]);

  return (
    <PageComponentError message={typedComponentProps == null ? "Fail" : ""}>
      <RichTextRenderer content={typedComponentProps!.text}/>
    </PageComponentError>
  )
}

RichText.Editor = RichTextEditor