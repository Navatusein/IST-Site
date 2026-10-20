import {Metadata} from "next";
import {pageTitle} from "@/app/page-components/page-title";
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
    title: await pageTitle(news.title),
    ...(description && {description}),
    openGraph: {type: "article", title: news.title, description, publishedTime: news.date, images: image ? [image] : undefined}
  };
}

export default async function Page(props: IProps) {
  const {path} = await props.params;

  const news = await unwrapServerAction(getNewsByPathAction(path));

  if (!news)
    notFound();

  const componentsData = await loadPageComponentsData(news.entities);

  return (
    <NewsView news={news} componentsData={componentsData}/>
  )
}