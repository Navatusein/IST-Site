import {useMemo} from "react";
import {IBasePageComponent} from "@/entities/dynamic-page";
import {PageComponentError} from "@/shared/ui-kit";
import MarkdownTextEditor from "../markdown-text-editor/markdown-text-editor";
import {IMarkdownTextPageComponent} from "../../types/type";
import {MarkdownRenderer} from "@/features/markdown-renderer";

interface IProps {
  componentProps: IBasePageComponent;
}

export default function MarkdownText(props: IProps) {
  const typedComponentProps = useMemo(() => {
    if (props.componentProps.type !== "markdown-text")
      return null;

    return props.componentProps as IMarkdownTextPageComponent;
  }, [props]);

  return (
    <PageComponentError message={typedComponentProps == null ? "Fail" : ""}>
      <MarkdownRenderer content={typedComponentProps!.text}/>
    </PageComponentError>
  )
}

MarkdownText.Editor = MarkdownTextEditor