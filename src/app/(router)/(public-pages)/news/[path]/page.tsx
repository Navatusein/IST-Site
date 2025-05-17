"use server"

import {notFound} from "next/navigation";
import {getNewsByPathAction} from "@/entities/news/actions/actions";
import {NewsView} from "@/views/news";
import {useServerAction} from "@/shared/hooks/use-server-action";


interface IProps {
  params: Promise<{
    path: string;
  }>
}

export default async function Page(props: IProps) {
  const {path} = await props.params;

  const news = await useServerAction(getNewsByPathAction(path));

  if (!news)
    notFound();

  return (
    <NewsView news={news}/>
  )
}