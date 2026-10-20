import {Metadata} from "next";
import {pageTitle} from "@/app/page-components/page-title";
import {notFound} from "next/navigation";
import {DynamicPageView} from "@/views/dynamic-page";
import {getDynamicPageByPathAction} from "@/entities/dynamic-page/actions/actions";
import {unwrapServerAction} from "@/shared/utilities/unwrap-server-action";
import {loadPageComponentsData} from "@/app/page-components/load-page-components-data";
import {getPageDescription} from "@/app/page-components/get-page-description";

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
  const page = await unwrapServerAction(getDynamicPageByPathAction(path.join("/")));

  if (!page || page.path == "home")
    return {};

  const description = page.description?.trim() || getPageDescription(page.entities);

  return {
    title: await pageTitle(page.title),
    ...(description && {description})
  };
}

export default async function Page(props: IProps) {
  const {path} = await props.params;

  const page = await unwrapServerAction(getDynamicPageByPathAction(path.join("/")));

  if (!page)
    notFound();

  const componentsData = await loadPageComponentsData(page.entities);

  return (
    <DynamicPageView page={page} componentsData={componentsData}/>
  );
}