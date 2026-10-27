import {Metadata} from "next";
import {notFound} from "next/navigation";
import {pageTitle} from "@/app/page-components/page-title";
import {DynamicPageView} from "@/views/dynamic-page";
import {getDynamicPageByPathAction} from "@/entities/dynamic-page/actions/actions";
import {unwrapServerAction} from "@/shared/utilities/unwrap-server-action";
import {loadPageComponentsData} from "@/app/page-components/load-page-components-data";
import {getPageDescription} from "@/app/page-components/get-page-description";
import {getPageImageSlug} from "@/app/page-components/get-page-image";
import {openGraph} from "@/app/page-components/open-graph";
import {getFileAssetUrl} from "@/shared/utilities/file-urls";
import {getDynamicPagePublicPath, HOME_PAGE_PATH} from "@/shared/utilities/public-paths";
import BreadcrumbsSection from "./breadcrumbs-section";

export async function getDynamicPageMetadata(path: string): Promise<Metadata> {
  const page = await unwrapServerAction(getDynamicPageByPathAction(path));

  if (!page)
    return {};

  const alternates = {canonical: getDynamicPagePublicPath(page.path)};

  if (page.path == HOME_PAGE_PATH)
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

export default async function DynamicPageRoute(props: {path: string}) {
  const page = await unwrapServerAction(getDynamicPageByPathAction(props.path));

  if (!page)
    notFound();

  const componentsData = await loadPageComponentsData(page.entities);

  return (
    <>
      <BreadcrumbsSection path={getDynamicPagePublicPath(page.path)} title={page.title || page.name}/>
      <DynamicPageView page={page} componentsData={componentsData}/>
    </>
  );
}
