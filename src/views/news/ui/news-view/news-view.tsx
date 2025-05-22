"use client"

import {INews} from "@/entities/news";
import dynamic from "next/dynamic";
import {Loader} from "@/shared/ui-kit";

interface IProps {
  news: INews;
}

const NewsRenderer = dynamic(() => import("@/views/news/ui/news-renderer/news-renderer"), {
  ssr: false,
  loading: () => <Loader/>
});

export default function NewsView(props: IProps) {
  return (
    <NewsRenderer news={props.news}/>
  )
}
