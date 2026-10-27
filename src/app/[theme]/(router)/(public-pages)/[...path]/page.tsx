import {Metadata} from "next";
import {pageTitle} from "@/app/page-components/page-title";
import {notFound} from "next/navigation";
import {DynamicPageView} from "@/views/dynamic-page";
import {getDynamicPageByPathAction} from "@/entities/dynamic-page/actions/actions";
import {unwrapServerAction} from "@/shared/utilities/unwrap-server-action";
import {loadPageComponentsData} from "@/app/page-components/load-page-components-data";
import {getPageDescription} from "@/app/page-components/get-page-description";
import {getPageImageSlug} from "@/app/page-components/get-page-image";
import {openGraph} from "@/app/page-components/open-graph";
import {getFileAssetUrl} from "@/shared/utilities/file-urls";

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

  if (!page)
    return {};

  const alternates = {canonical: `/${page.path}`};

  if (page.path == "home")
    return {alternates};

  const description = page.description?.trim() || getPageDescription(page.entities);
  const image = getFileAssetUrl(getPageImageSlug(page.entities));

  return {
    alternates,
    title: await pageTitle(page.title),
    ...(description && {description}),
    openGraph: await openGraph({
      title: page.title,
      url: alternates.canonical,
      ...(description && {description}),
      ...(image && {images: [image]})
    })
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