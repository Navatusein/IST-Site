import {IBasePageComponent} from "@/entities/base-page-component";
import {useMemo} from "react";
import {PageComponentError} from "@/shared/ui-kit";
import {ITextPageComponent} from "../../types/type";
import Markdown from "react-markdown";

interface IProps {
  propsClass: IBasePageComponent;
}

export default function TextPageComponentEditor(props: IProps) {
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
