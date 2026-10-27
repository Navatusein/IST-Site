"use client"

import {useState} from "react";
import {IPageEntity} from "@/entities/dynamic-page";
import {INews} from "@/entities/news";
import {updateNewsAction} from "@/entities/news/actions/actions";
import {unwrapServerAction} from "@/shared/utilities/unwrap-server-action";
import dynamic from "next/dynamic";
import {Loader} from "@/shared/ui-kit";

interface IProps {
  news: INews;
}

const DynamicPageEditor = dynamic(() => import("@/widgets/dynamic-page-editor/ui/dynamic-page-editor/dynamic-page-editor"), {
  ssr: false,
  loading: () => <Loader fullScreen/>
});

export default function AdminNewsPageEdit(props: IProps) {
  const [entities, setEntities] = useState<IPageEntity[]>(props.news.entities);
  const [recordId, setRecordId] = useState<string>(String(props.news._id));

  if (recordId != String(props.news._id)) {
    setRecordId(String(props.news._id));
    setEntities(props.news.entities);
  }

  const saveEntities = async (value: IPageEntity[]) => {
    await unwrapServerAction(updateNewsAction({_id: props.news._id, entities: value} as Pick<INews, "_id" | "entities"> as INews));
  }

  return (
    <DynamicPageEditor
      key={recordId}
      entities={entities}
      setEntities={setEntities}
      saveEntities={saveEntities}
      mainHeading={{text: props.news.title, isShownByPage: true}}
      history={{collection: "news", recordId}}
    />
  )
}
