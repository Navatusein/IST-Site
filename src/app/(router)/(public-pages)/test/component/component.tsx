"use client"

import {Button, theme} from "antd";
import {useEffect, useState} from "react";
import {INews} from "@/entities/news";
import {getNewsPaginationAction} from "@/entities/news/actions/actions";
import {NewsList} from "@/widgets/news-list";

const typedComponentProps = {
  countDisplayedNews: 5,
}

export default function Component() {
  const {token: {colorTextLightSolid, colorPrimary, colorSuccess}} = theme.useToken();

  const [news, setNews] = useState<INews[]>([]);

  useEffect(() => {
    getNewsPaginationAction(0, typedComponentProps.countDisplayedNews)
      .then((data) => {
        setNews(() => data);
      })
  }, [typedComponentProps]);

  return (
    <>
      <NewsList newsList={news}/>
    </>
  )
}