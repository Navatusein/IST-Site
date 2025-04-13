"use client"

import {useEffect, useState} from "react";
import {IBasePageComponent} from "@/entities/dynamic-page";
import {INews} from "@/entities/news";
import {DynamicPageEditor} from "@/widgets/dynamic-page-editor";
import {updateNewsAction} from "@/entities/news/actions/actions";

interface IProps {
  news: INews;
}

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
    await updateNewsAction(news);
  }

  return (
    <DynamicPageEditor
      components={news.components}
      setComponents={setComponents}
      saveComponents={saveComponents}
    />
  )
}
