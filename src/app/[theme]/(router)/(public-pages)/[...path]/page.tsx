import {Metadata} from "next";
import DynamicPageRoute, {getDynamicPageMetadata} from "@/app/page-components/dynamic-page-route";

export const revalidate = 86400;

export function generateStaticParams() {
  return [];
}

interface IProps {
  params: Promise<{
    path: string[];
  }>
}

export async function generateMetadata(props: IProps): Promise<Metadata> {
  const {path} = await props.params;
  return getDynamicPageMetadata(path.join("/"));
}

export default async function Page(props: IProps) {
  const {path} = await props.params;

  return (
    <DynamicPageRoute path={path.join("/")}/>
  );
}
