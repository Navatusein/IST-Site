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

  return (
    <FileViewerView path={path.join("/")}/>
  )
}