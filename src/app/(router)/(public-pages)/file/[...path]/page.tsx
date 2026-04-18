"use server"

import {FileViewerView} from "@/views/file-viewer";

interface IProps {
  params: Promise<{
    path: string[];
  }>
}

export default async function Page(props: IProps) {
  const {path} = await props.params;

  return (
    <FileViewerView path={path.join("/")}/>
  )
}