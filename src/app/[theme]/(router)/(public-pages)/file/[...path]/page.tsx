import {Metadata} from "next";
import {FileManagerService} from "@/entities/file/services/file-manager-service";
import {FileViewerView} from "@/views/file-viewer";
import {notFound} from "next/navigation";

export const metadata: Metadata = {robots: {index: false, follow: false}};

export const revalidate = 86400;

export function generateStaticParams() {
  return [];
}

interface IProps {
  params: Promise<{
    path: string[];
  }>
}

export default async function Page(props: IProps) {
  const {path} = await props.params;
  const file = await FileManagerService.findFile(path);

  if (!file)
    notFound();

  return (
    <FileViewerView file={file}/>
  )
}