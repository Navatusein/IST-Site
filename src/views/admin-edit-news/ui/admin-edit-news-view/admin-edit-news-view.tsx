"use client"

import {useEffect, useState} from "react";
import {IBasePageComponent} from "@/entities/dynamic-page";
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

export default function AdminEditNewsView(props: IProps) {
  const [news, setNews] = useState<INews>(props.news);

  useEffect(() => {
    setNews(() => props.news);
  }, [props.news]);

  const setComponents = (components: IBasePageComponent[]) => {
    setNews((prevState) => (
      {...prevState, components: components} as INews
    ));
  }

  const saveComponents = async () => {
    await useServerAction(updateNewsAction(news));
  }

  return (
    <DynamicPageEditor
      components={news.components}
      setComponents={setComponents}
      saveComponents={saveComponents}
    />
  )
}
