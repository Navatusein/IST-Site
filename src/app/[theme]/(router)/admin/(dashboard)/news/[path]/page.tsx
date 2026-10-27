import {Metadata} from "next";
import {notFound} from "next/navigation";
import {getNewsByPathAction} from "@/entities/news/actions/actions";
import {AdminNewsPageEdit} from "@/views/admin-news-page-edit";
import {unwrapServerAction} from "@/shared/utilities/unwrap-server-action";


interface IProps {
  params: Promise<{
    path: string;
  }>
}

export async function generateMetadata(props: IProps): Promise<Metadata> {
  const {path} = await props.params;

  const news = await unwrapServerAction(getNewsByPathAction(path)).catch(() => null);

  return {title: news ? `Редагування: ${news.title}` : "Редагування"};
}

export default async function Page(props: IProps) {
  const {path} = await props.params;

  const news = await unwrapServerAction(getNewsByPathAction(path));

  if (!news)
    notFound();

  return (
    <AdminNewsPageEdit news={news}/>
  )
}