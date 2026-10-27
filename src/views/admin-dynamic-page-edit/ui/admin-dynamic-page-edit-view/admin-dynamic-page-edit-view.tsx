"use client"

import {IDynamicPage, IPageEntity} from "@/entities/dynamic-page";
import {useState} from "react";
import {updateDynamicPageAction} from "@/entities/dynamic-page/actions/actions";
import {unwrapServerAction} from "@/shared/utilities/unwrap-server-action";
import dynamic from "next/dynamic";
import {Loader} from "@/shared/ui-kit";

interface IProps {
  page: IDynamicPage
}

const DynamicPageEditor = dynamic(() => import("@/widgets/dynamic-page-editor/ui/dynamic-page-editor/dynamic-page-editor"), {
  ssr: false,
  loading: () => <Loader fullScreen/>
});

export default function AdminDynamicPageEditView(props: IProps) {
  const [entities, setEntities] = useState<IPageEntity[]>(props.page.entities);
  const [recordId, setRecordId] = useState<string>(String(props.page._id));

  if (recordId != String(props.page._id)) {
    setRecordId(String(props.page._id));
    setEntities(props.page.entities);
  }

  const saveEntities = async (value: IPageEntity[]) => {
    await unwrapServerAction(updateDynamicPageAction({_id: props.page._id, entities: value} as Pick<IDynamicPage, "_id" | "entities"> as IDynamicPage));
  }

  return (
    <DynamicPageEditor
      key={recordId}
      entities={entities}
      setEntities={setEntities}
      saveEntities={saveEntities}
      mainHeading={{text: props.page.title || props.page.name, isShownByPage: false}}
      history={{collection: "dynamic-pages", recordId}}
    />
  )
}
