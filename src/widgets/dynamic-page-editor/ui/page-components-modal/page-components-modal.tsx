import {Button, Flex, Modal, theme, Typography} from "antd";
import {PageComponentRenderer} from "@/widgets/page-component-renderer";
import {IBasePageComponent} from "@/entities/dynamic-page";
import {Dispatch, SetStateAction} from "react";
import { pageComponentExamples } from "../../types/type";

interface IProps {
  isModalOpen: boolean;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
  addComponent: (value: IBasePageComponent) => void;
}

export default function PageComponentsModal(props: IProps) {
  const {token: {colorBgLayout}} = theme.useToken();

  const closeModal = () => {
    props.setIsModalOpen(() => false);
  }

  const addComponent = (component: IBasePageComponent) => {
    props.addComponent(component);
    props.setIsModalOpen(() => false);
  }

  return (
    <Modal
      open={props.isModalOpen}
      onCancel={closeModal}
      title="Додати новий блок"
      width={1000}
      footer={null}
    >
      <Flex gap="middle" vertical>
        {pageComponentExamples.map((component, index) => (
          <Button
            style={{padding: "10px", height: "100%", width: "100%", background: colorBgLayout}}
            key={`example-${index}`}
            onClick={() => addComponent(component.component)}
          >
            <Flex vertical style={{ height: "100%", width: "100%"}}>
              <Typography.Title level={5}>
                {component.name}
              </Typography.Title>
              {/*<div style={{zoom: "0.7", textAlign: "start", position: "relative", height: "100%", width: "100%"}}>*/}
              {/*  <PageComponentRenderer propsClass={component.component}/>*/}
              {/*  <div style={{position: "absolute", top: 0, left: 0, right: 0, bottom: "0"}}/>*/}
              {/*</div>*/}
            </Flex>
          </Button>
        ))}
      </Flex>
    </Modal>
  )
}
