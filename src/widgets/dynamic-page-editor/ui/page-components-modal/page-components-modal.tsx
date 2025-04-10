import {Button, Flex, Modal, Row, theme, Typography} from "antd";
import {PageComponentRenderer} from "@/widgets/page-component-renderer";
import {ITextPageComponent} from "@/widgets/text-page-component";
import {IPageComponentExample} from "../../types/type";
import {IBasePageComponent} from "@/entities/dynamic-page";
import {Dispatch, SetStateAction} from "react";

interface IProps {
  isModalOpen: boolean;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
  addComponent: (value: IBasePageComponent) => void;
}

const PAGE_COMPONENTS: IPageComponentExample[] = [
  {
    name: "Text",
    component: {type: "text", content: "Hi i am text component"} as ITextPageComponent
  }
]

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
    <Modal open={props.isModalOpen} onCancel={closeModal} title="Додати новий блок" width={1000}>
      <Row>
        {PAGE_COMPONENTS.map((component, index) => (
          <Button
            style={{padding: "10px", height: "100%", width: "100%", background: colorBgLayout}}
            key={`example-${index}`}
            onClick={() => addComponent(component.component)}
          >
            <Flex vertical style={{ height: "100%", width: "100%"}}>
              <Typography.Title level={5}>
                {component.name}
              </Typography.Title>
              <div style={{zoom: "0.7", textAlign: "start", position: "relative", height: "100%", width: "100%"}}>
                <PageComponentRenderer propsClass={component.component}/>
                <div style={{position: "absolute", top: 0, left: 0, right: 0, bottom: "0"}}/>
              </div>
            </Flex>
          </Button>
        ))}
      </Row>
    </Modal>
  )
}
