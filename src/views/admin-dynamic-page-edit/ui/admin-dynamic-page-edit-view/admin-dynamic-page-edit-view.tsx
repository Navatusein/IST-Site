"use client"

import {IDynamicPage, IPageEntity} from "@/entities/dynamic-page";
import {useEffect, useState} from "react";
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
  const [page, setPage] = useState<IDynamicPage>(props.page);

  useEffect(() => {
    setPage(() => props.page);
  }, [props.page]);

  const setEntities = (entities: IPageEntity[]) => {
    setPage((prevState) => (
      {...prevState, entities: entities} as IDynamicPage
    ));
  }

  const saveComponents = async () => {
    await unwrapServerAction(updateDynamicPageAction(page));
  }

  return (
    <DynamicPageEditor
      entities={page.entities}
      setEntities={setEntities}
      saveEntities={saveComponents}
    />
  )
}
