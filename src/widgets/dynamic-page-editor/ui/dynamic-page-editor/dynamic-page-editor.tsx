"use client"

import {useRouter} from "next/navigation";
import {App, Button, Flex} from "antd";
import {useMemo, useState} from "react";
import {IPageEntity} from "@/entities/dynamic-page";
import FloatButtonGroup from "../float-button-group/float-button-group";
import DynamicPageHeader from "../dynamic-page-header/dynamic-page-header";
import PageEntityList from "../page-entity-list/page-entity-list";
import AddPageComponentDrawer from "../add-page-component-drawer/add-page-component-drawer";

interface IProps {
  entities: IPageEntity[];
  setEntities: (value:IPageEntity[]) => void;
  saveEntities: () => Promise<void>;
}

export default function DynamicPageEditor(props: IProps) {
  const router = useRouter()
  const {notification, modal} = App.useApp();

  const [initialState, setInitialState] = useState<IPageEntity[]>(props.entities)

  const isChanged = useMemo(() => {
    if (props.entities.length != initialState.length)
      return true;

    for (let i = 0; i < props.entities.length; i++) {
      if (JSON.stringify(initialState[i]) != JSON.stringify(props.entities[i]))
        return true;
    }

    return false;
  }, [props.entities]);

  const [isAddPageComponentDrawerOpen, setIsAddPageComponentDrawerOpen] = useState<boolean>(false);

  const updateEntities = (entities: IPageEntity[]) => {
    props.setEntities(entities);
  }

  const updateEntity = (entity: IPageEntity, index: number) => {
    props.setEntities([...props.entities.slice(0, index), entity, ...props.entities.slice(index + 1)]);
  }

  const addEntity = (entity: IPageEntity) => {
    props.setEntities([...props.entities, {...entity, id: crypto.randomUUID()}]);
  }

  const removeEntity = (index: number) => {
    props.setEntities([...props.entities.slice(0, index), ...props.entities.slice(index + 1)]);
  }

  const cancelChanges = () => {
    modal.confirm({
      title: "Відмінити зміни",
      content: "Ви впевнені що хочете відмінити зміни?",
      okText: "Так",
      cancelText: "Ні",
      onOk: () => {
        props.setEntities(initialState);
      }
    });
  }

  const saveChanges = () => {
    props.saveEntities()
      .then(() => {
        notification.success({
          title: "Успішно збережено"
        });

        setInitialState(props.entities);

        setTimeout(() => {
          router.refresh();
        }, 500);
      })
      .catch((error) => {
        notification.error({
          title: "Помилка збереження",
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
        <PageEntityList
          entities={props.entities}
          updateEntities={updateEntities}
          updateEntity={updateEntity}
          removeEntity={removeEntity}
        />
        <Flex vertical gap="small" style={{padding: "12px"}}>
          <Button block type="dashed" size="large" onClick={() => setIsAddPageComponentDrawerOpen(true)}>
            Додати новий блок
          </Button>
        </Flex>
      </Flex>
      <FloatButtonGroup
        setIsAddPageComponentDrawerOpen={setIsAddPageComponentDrawerOpen}
      />
      <AddPageComponentDrawer
        isOpen={isAddPageComponentDrawerOpen}
        setIsOpen={setIsAddPageComponentDrawerOpen}
        addEntity={addEntity}
        showGroupComponent={true}
      />
    </>
  )
}
