"use client"

import {useRouter} from "next/navigation";
import {App, Flex} from "antd";
import {useEffect, useState} from "react";
import {IBasePageComponent, IDynamicPage} from "@/entities/dynamic-page";
import {updateDynamicPageAction} from "@/entities/dynamic-page/actions/actions";
import AddPageComponentButton from "../add-page-component-button/add-page-component-button";
import PageComponentsList from "../page-components-list/page-components-list";
import FloatButtonGroup from "../float-button-group/float-button-group";
import PageComponentsModal from "../page-components-modal/page-components-modal";
import DynamicPageEditorDrawer from "../dynamic-page-editor-drawer/dynamic-page-editor-drawer";

interface IProps {
  page: IDynamicPage
}

export default function DynamicPageEditor(props: IProps) {
  const router = useRouter()

  const {notification} = App.useApp();

  const [page, setPage] = useState<IDynamicPage>(props.page);
  const [editMode, setEditMode] = useState<boolean>(true);

  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    setPage(props.page)
  }, [props.page]);

  const updateComponents = (components: IBasePageComponent[]) => {
    setPage((prevState) => ({
      ...prevState,
      components: components
    } as IDynamicPage));
  }

  const updateComponent = (component: IBasePageComponent, index: number) => {
    setPage((prevState) => ({
      ...prevState,
      components: [...prevState.components.slice(0, index), component, ...prevState.components.slice(index + 1)]
    } as IDynamicPage));
  }

  const addComponent = (component: IBasePageComponent) => {
    setPage((prevState) => ({
      ...prevState,
      components: [...prevState.components, {...component, id: crypto.randomUUID()}]
    } as IDynamicPage));
  }

  const removeComponent = (index: number) => {
    setPage((prevState) => ({
      ...prevState,
      components: [...prevState.components.slice(0, index), ...prevState.components.slice(index + 1)]
    } as IDynamicPage));
  }

  const savePage = () => {
    updateDynamicPageAction(page)
      .then(() => {
        notification.success({
          message: "Успішно збережено"
        });

        setTimeout(() => {
          router.refresh();
        }, 500);
      })
      .catch((error) => {
        notification.error({
          message: "Помилка",
          description: error.message
        });
      });
  }

  return (
    <>
      <Flex gap={editMode ? "small" : "unset"} vertical>
        <PageComponentsList
          components={page.components}
          editMode={editMode}
          updateComponents={updateComponents}
          updateComponent={updateComponent}
          removeComponent={removeComponent}
        />
        <AddPageComponentButton
          editMode={editMode}
          setIsModalOpen={setIsModalOpen}
        />
        <FloatButtonGroup
          setIsDrawerOpen={setIsDrawerOpen}
        />
        <PageComponentsModal
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          addComponent={addComponent}
        />
        <DynamicPageEditorDrawer
          isDrawerOpen={isDrawerOpen}
          setIsDrawerOpen={setIsDrawerOpen}
          editMode={editMode}
          setEditMode={setEditMode}
          savePage={savePage}
        />
      </Flex>
    </>
  )
}
