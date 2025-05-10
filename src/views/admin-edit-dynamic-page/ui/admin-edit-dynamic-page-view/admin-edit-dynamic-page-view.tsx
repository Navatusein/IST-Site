"use client"

import {IBasePageComponent, IDynamicPage} from "@/entities/dynamic-page";
import {DynamicPageEditor} from "@/widgets/dynamic-page-editor";
import {useEffect, useState} from "react";
import {updateDynamicPageAction} from "@/entities/dynamic-page/actions/actions";

interface IProps {
  page: IDynamicPage
}

export default function AdminEditDynamicPageView(props: IProps) {
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
    await updateDynamicPageAction(page);
  }

  return (
    <DynamicPageEditor
      components={page.components}
      setComponents={setComponents}
      saveComponents={saveComponents}
    />
  )
}
