import {useMemo} from "react";
import {IBasePageComponent} from "@/entities/dynamic-page";
import {PageComponentError} from "@/shared/ui-kit";
import RichTextEditor from "@/page-components/rich-text/ui/rich-text-editor/rich-text-editor";
import {IRichTextPageComponent} from "../../types/type";
import {RichTextRenderer} from "../../../../features/rich-text-renderer";

interface IProps {
  component: IBasePageComponent;
}

export default function RichText(props: IProps) {
  const typedComponent = useMemo(() => {
    if (props.component.componentType !== "rich-text")
      return null;

    return props.component as IRichTextPageComponent;
  }, [props]);

  return (
    <PageComponentError component={typedComponent}>
      <RichTextRenderer content={typedComponent!.text}/>
    </PageComponentError>
  )
}

RichText.Editor = RichTextEditor