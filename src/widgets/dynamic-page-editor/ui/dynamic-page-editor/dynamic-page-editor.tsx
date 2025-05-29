"use client"

import {useRouter} from "next/navigation";
import {App, Flex} from "antd";
import {useState} from "react";
import {IBasePageComponent} from "@/entities/dynamic-page";
import AddPageComponentButton from "../add-page-component-button/add-page-component-button";
import PageComponentList from "@/widgets/dynamic-page-editor/ui/page-component-list/page-component-list";
import FloatButtonGroup from "../float-button-group/float-button-group";
import AddPageComponentDrawer from "@/widgets/dynamic-page-editor/ui/add-page-component-drawer/add-page-component-drawer";
import DynamicPageEditorDrawer from "../dynamic-page-editor-drawer/dynamic-page-editor-drawer";

interface IProps {
  components: IBasePageComponent[];
  setComponents: (value:IBasePageComponent[]) => void;
  saveComponents: () => Promise<void>;
}

export default function DynamicPageEditor(props: IProps) {
  const router = useRouter()

  const {notification} = App.useApp();

  const [editMode, setEditMode] = useState<boolean>(true);

  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [isAddPageComponentDrawerOpen, setIsAddPageComponentDrawerOpen] = useState<boolean>(false);

  const updateComponents = (components: IBasePageComponent[]) => {
    props.setComponents(components);
  }

  const updateComponent = (component: IBasePageComponent, index: number) => {
    props.setComponents([...props.components.slice(0, index), component, ...props.components.slice(index + 1)]);
  }

  const addComponent = (component: IBasePageComponent) => {
    props.setComponents([...props.components, {...component, id: crypto.randomUUID()}]);
  }

  const removeComponent = (index: number) => {
    props.setComponents([...props.components.slice(0, index), ...props.components.slice(index + 1)]);
  }

  const savePage = () => {
    props.saveComponents()
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
          message: "Помилка збереження",
          description: error.message
        });
      });
  }

  return (
    <>
      <Flex vertical>
        <PageComponentList
          components={props.components}
          editMode={editMode}
          updateComponents={updateComponents}
          updateComponent={updateComponent}
          removeComponent={removeComponent}
        />
        <AddPageComponentButton
          editMode={editMode}
          setIsModalOpen={setIsAddPageComponentDrawerOpen}
        />
      </Flex>
      <FloatButtonGroup
        setIsDrawerOpen={setIsDrawerOpen}
      />
      <AddPageComponentDrawer
        isOpen={isAddPageComponentDrawerOpen}
        setIsOpen={setIsAddPageComponentDrawerOpen}
        addComponent={addComponent}
      />
      <DynamicPageEditorDrawer
        isDrawerOpen={isDrawerOpen}
        setIsDrawerOpen={setIsDrawerOpen}
        editMode={editMode}
        setEditMode={setEditMode}
        savePage={savePage}
      />
    </>
  )
}
