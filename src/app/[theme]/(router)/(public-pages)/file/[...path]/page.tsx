import {FileManagerService} from "@/entities/file/services/file-manager-service";
import {FileViewerView} from "@/views/file-viewer";

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

  return (
    <FileViewerView file={file}/>
  )
}