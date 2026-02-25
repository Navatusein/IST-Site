"use client"

import {IBasePageComponent, IDynamicPage} from "@/entities/dynamic-page";
import {useEffect, useState} from "react";
import {updateDynamicPageAction} from "@/entities/dynamic-page/actions/actions";
import {useServerAction} from "@/shared/hooks/use-server-action";
import dynamic from "next/dynamic";
import {Loader} from "@/shared/ui-kit";

interface IProps {
  page: IDynamicPage
}

const DynamicPageEditor = dynamic(() => import("@/widgets/dynamic-page-editor/ui/dynamic-page-editor/dynamic-page-editor"), {
  ssr: false,
  loading: () => <Loader/>
});

export default function AdminDynamicPageEditView(props: IProps) {
  const [page, setPage] = useState<IDynamicPage>(props.page);

  useEffect(() => {
    setPage(() => props.page);
  }, [props.page]);

  const setComponents = (components: IBasePageComponent[]) => {
    setPage((prevState) => (
      {...prevState, components: components} as IDynamicPage
    ));
  }

  const saveComponents = async () => {
    await useServerAction(updateDynamicPageAction(page));
  }

  return (
    <DynamicPageEditor
      components={page.components}
      setComponents={setComponents}
      saveComponents={saveComponents}
    />
  )
}
