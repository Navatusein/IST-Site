import {Metadata} from "next";
import {pageTitle} from "@/app/page-components/page-title";
import {openGraph} from "@/app/page-components/open-graph";
import {getSiteSettingsAction} from "@/entities/site-settings/actions/actions";
import {SITE_SETTINGS_DEFAULTS} from "@/entities/site-settings/types/type";
import {JsonLd} from "@/shared/ui-kit";
import {newsStructuredData} from "@/app/page-components/structured-data";
import BreadcrumbsSection from "@/app/page-components/breadcrumbs-section";
import {notFound} from "next/navigation";
import {getNewsByPathAction} from "@/entities/news/actions/actions";
import {NewsView} from "@/views/news";
import {unwrapServerAction} from "@/shared/utilities/unwrap-server-action";
import {loadPageComponentsData} from "@/app/page-components/load-page-components-data";
import {getPageDescription} from "@/app/page-components/get-page-description";
import {getFileAssetUrl} from "@/shared/utilities/file-urls";

export const revalidate = 86400;

export function generateStaticParams() {
  return [];
}

interface IProps {
  params: Promise<{
    path: string;
  }>
}

export async function generateMetadata(props: IProps): Promise<Metadata> {
  const {path} = await props.params;
  const news = await unwrapServerAction(getNewsByPathAction(path));

  if (!news)
    return {};

  const description = news.description || getPageDescription(news.entities);
  const image = getFileAssetUrl(news.imageSlug);

  return {
    alternates: {canonical: `/news/${news.path}`},
    title: await pageTitle(news.title),
    ...(description && {description}),
    openGraph: await openGraph({
      type: "article",
      title: news.title,
      url: `/news/${news.path}`,
      publishedTime: news.date,
      ...(description && {description}),
      ...(image && {images: [image]})
    })
  };
}

export default async function Page(props: IProps) {
  const {path} = await props.params;

  const news = await unwrapServerAction(getNewsByPathAction(path));

  if (!news)
    notFound();

  const [componentsData, settings] = await Promise.all([
    loadPageComponentsData(news.entities),
    unwrapServerAction(getSiteSettingsAction()).catch(() => SITE_SETTINGS_DEFAULTS)
  ]);

  return (
    <>
      <JsonLd data={newsStructuredData(news, settings)}/>
      <BreadcrumbsSection path={`/news/${news.path}`} title={news.title}/>
      <NewsView news={news} componentsData={componentsData}/>
    </>
  )
}