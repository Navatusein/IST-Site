"use client"

import {useEffect, useState} from "react";
import {IPageEntity} from "@/entities/dynamic-page";
import {INews} from "@/entities/news";
import {updateNewsAction} from "@/entities/news/actions/actions";
import {useServerAction} from "@/shared/hooks/use-server-action";
import dynamic from "next/dynamic";
import {Loader} from "@/shared/ui-kit";

interface IProps {
  news: INews;
}

const DynamicPageEditor = dynamic(() => import("@/widgets/dynamic-page-editor/ui/dynamic-page-editor/dynamic-page-editor"), {
  ssr: false,
  loading: () => <Loader/>
});

export default function AdminNewsPageEdit(props: IProps) {
  const [news, setNews] = useState<INews>(props.news);

  useEffect(() => {
    setNews(() => props.news);
  }, [props.news]);

  const setEntities = (entities: IPageEntity[]) => {
    setNews((prevState) => (
      {...prevState, entities: entities} as INews
    ));
  }

  const saveEntities = async () => {
    await useServerAction(updateNewsAction(news));
  }

  return (
    <DynamicPageEditor
      entities={news.entities}
      setEntities={setEntities}
      saveEntities={saveEntities}
    />
  )
}
