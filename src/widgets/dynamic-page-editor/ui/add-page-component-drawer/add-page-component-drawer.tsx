import {Button, Drawer, Flex, Typography} from "antd";
import {IBasePageComponent} from "@/entities/dynamic-page";
import {Dispatch, SetStateAction} from "react";
import {pageComponentExamples} from "@/page-components";

interface IProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  addComponent: (value: IBasePageComponent) => void;
}

export default function AddPageComponentDrawer(props: IProps) {
  const closeModal = () => {
    props.setIsOpen(() => false);
  }

  const addComponent = (component: IBasePageComponent) => {
    props.addComponent(component);
    props.setIsOpen(() => false);
  }

  return (
    <Drawer
      open={props.isOpen}
      onClose={closeModal}
      width={800}
      title="Додати новий блок"
    >
      <Flex gap="middle" vertical>
        {pageComponentExamples.map((component, index) => (
          <Button
            style={{padding: "10px", height: "100%", width: "100%"}}
            key={`example-${index}`}
            onClick={() => addComponent(component.component)}
          >
            <Flex vertical style={{ height: "100%", width: "100%"}}>
              <Typography.Title level={5}>
                {component.name}
              </Typography.Title>
            </Flex>
          </Button>
        ))}
      </Flex>
    </Drawer>
  )
}
