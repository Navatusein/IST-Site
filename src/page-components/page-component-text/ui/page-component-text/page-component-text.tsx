"use client"

import {IBasePageComponent} from "@/entities/dynamic-page";
import {useMemo} from "react";
import {PageComponentError} from "@/shared/ui-kit";
import Markdown from "react-markdown";
import PageComponentTextEditor from "@/page-components/page-component-text/ui/page-component-text-editor/page-component-text-editor";
import {ITextPageComponent} from "../../types/type";

interface IProps {
  componentProps: IBasePageComponent;
}


export default function PageComponentText(props: IProps) {
  const typedComponentProps = useMemo(() => {
    if (props.componentProps.type !== "text")
      return null;

    return props.componentProps as ITextPageComponent;
  }, [props]);

  return (
    <PageComponentError message={typedComponentProps == null ? "Fail" : ""}>
      <Markdown>
        {typedComponentProps?.content}
      </Markdown>
    </PageComponentError>
  )
}

PageComponentText.Editor = PageComponentTextEditor;
