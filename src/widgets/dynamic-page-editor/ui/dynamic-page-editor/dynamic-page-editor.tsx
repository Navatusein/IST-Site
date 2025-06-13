"use client"

import {useRouter} from "next/navigation";
import {App, Flex} from "antd";
import {useMemo, useState} from "react";
import {IBasePageComponent} from "@/entities/dynamic-page";
import AddPageComponentButton from "../add-page-component-button/add-page-component-button";
import FloatButtonGroup from "../float-button-group/float-button-group";
import DynamicPageHeader from "../dynamic-page-header/dynamic-page-header";
import PageComponentList from "../page-component-list/page-component-list";
import AddPageComponentDrawer from "../add-page-component-drawer/add-page-component-drawer";

interface IProps {
  components: IBasePageComponent[];
  setComponents: (value:IBasePageComponent[]) => void;
  saveComponents: () => Promise<void>;
}

export default function DynamicPageEditor(props: IProps) {
  const router = useRouter()
  const {notification, modal} = App.useApp();

  const [initialComponentsState, setInitialComponentsState] = useState<IBasePageComponent[]>(props.components)

  const isChanged = useMemo(() => {
    if (props.components.length != initialComponentsState.length)
      return true;

    for (let i = 0; i < props.components.length; i++) {
      if (JSON.stringify(initialComponentsState[i]) != JSON.stringify(props.components[i]))
        return true;
    }

    return false;
  }, [props.components]);

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

  const cancelChanges = () => {
    modal.confirm({
      title: "Відмінити зміни",
      content: "Ви впевнені що хочите відмінити зміни?",
      okText: "Так",
      cancelText: "Ні",
      onOk: () => {
        props.setComponents(initialComponentsState);
      }
    });
  }

  const saveChanges = () => {
    props.saveComponents()
      .then(() => {
        notification.success({
          message: "Успішно збережено"
        });

        setInitialComponentsState(props.components);

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
      <DynamicPageHeader
        isChanged={isChanged}
        cancelChanges={cancelChanges}
        saveChanges={saveChanges}
      />
      <Flex vertical style={{overflowX: "hidden"}}>
        <PageComponentList
          components={props.components}
          updateComponents={updateComponents}
          updateComponent={updateComponent}
          removeComponent={removeComponent}
        />
        <AddPageComponentButton
          setIsModalOpen={setIsAddPageComponentDrawerOpen}
        />
      </Flex>
      <FloatButtonGroup
        setIsAddPageComponentDrawerOpen={setIsAddPageComponentDrawerOpen}
      />
      <AddPageComponentDrawer
        isOpen={isAddPageComponentDrawerOpen}
        setIsOpen={setIsAddPageComponentDrawerOpen}
        addComponent={addComponent}
      />
    </>
  )
}
