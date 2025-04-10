import Markdown from "react-markdown";
import {useMemo} from "react";
import {PageComponentError} from "@/shared/ui-kit";
import TextPageComponentEditor from "../text-page-component-editor/text-page-component-editor";
import {ITextPageComponent} from "../../types/type";
import {IBasePageComponent} from "@/entities/dynamic-page";

interface IProps {
  propsClass: IBasePageComponent;
}

export default function TextPageComponent(props: IProps) {
  const propsClass = useMemo(() => {
    if (props.propsClass.type !== "text")
      return null;

    return props.propsClass as ITextPageComponent;
  }, [props])

  return (
    <PageComponentError message={propsClass == null ? "Fail" : ""}>
      <Markdown>
        {propsClass?.content}
      </Markdown>
    </PageComponentError>
  )
}

TextPageComponent.Editor = TextPageComponentEditor;