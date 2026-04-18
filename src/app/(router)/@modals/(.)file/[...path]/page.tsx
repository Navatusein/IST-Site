"use server"

import {FileViewerModalView} from "@/views/file-viewer-modal";

interface IProps {
  params: Promise<{
    path: string[];
  }>
}

export default async function Page(props: IProps) {
  const {path} = await props.params;

  return (
    <FileViewerModalView path={path.join("/")}/>
  )
}