import {ReactNode} from "react";
import {PageEditorLayout} from "@/app/layouts/page-editor-layout";

interface IProps {
  children: ReactNode;
}

export default async function Layout(props: IProps) {
  return (
    <PageEditorLayout>
      {props.children}
    </PageEditorLayout>
  );
}
