"use server"

import {notFound} from "next/navigation";
import {getNewsByPathAction} from "@/entities/news/actions/actions";
import {NewsView} from "@/views/news";
import {AdminEditNewsView} from "@/views/admin-edit-news";


interface IProps {
  params: Promise<{
    path: string;
  }>
}

export default async function Page(props: IProps) {
  const {path} = await props.params;

  const news = await getNewsByPathAction(path);

  if (!news)
    notFound();

  return (
    <AdminEditNewsView news={news}/>
  )
}