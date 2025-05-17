import {Button, Flex, Modal, theme, Typography} from "antd";
import {IBasePageComponent} from "@/entities/dynamic-page";
import {Dispatch, SetStateAction} from "react";
import {pageComponentExamples} from "@/page-components";

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
      footer={null}
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
    </Modal>
  )
}
