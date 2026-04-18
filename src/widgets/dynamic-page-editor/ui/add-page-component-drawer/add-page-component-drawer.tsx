import {Button, Col, Divider, Drawer, Flex, Row, Typography} from "antd";
import {IPageEntity} from "@/entities/dynamic-page";
import {Dispatch, SetStateAction} from "react";
import {pageComponentGroupExamples} from "@/page-components";

interface IProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  addEntity: (value: IPageEntity) => void;
  showGroupComponent?: boolean;
}

export default function AddPageComponentDrawer(props: IProps) {
  const closeModal = () => {
    props.setIsOpen(() => false);
  }

  const addEntity = (component: IPageEntity) => {
    props.addEntity(component);
    props.setIsOpen(() => false);
  }

  return (
    <Drawer
      open={props.isOpen}
      onClose={closeModal}
      size="large"
      title="Додати новий блок"
    >
      <Flex vertical gap="middle">
        {pageComponentGroupExamples.map((group, groupIndex) => (
          <Flex vertical gap="small" key={`group-${group.name}`}>
            <Flex vertical>
              <Typography.Title level={5} style={{margin: 0}}>
                {group.title}
              </Typography.Title>
              <Typography.Text>
                {group.description}
              </Typography.Text>
            </Flex>
            <Row gutter={[8, 8]}>
              {group.components.map((component, componentIndex) => (
                <Col span={12} key={`example-${group.name}-${componentIndex}`}>
                  <Button
                    style={{padding: "10px", height: "100%", width: "100%"}}
                    onClick={() => addEntity(component.component)}
                  >
                    <Flex vertical style={{height: "100%", width: "100%"}}>
                      <Typography.Text strong ellipsis>
                        {component.name}
                      </Typography.Text>
                    </Flex>
                  </Button>
                </Col>
              ))}
            </Row>
            {groupIndex != pageComponentGroupExamples.length - 1 && (
              <Divider style={{marginBottom: 0, marginTop: 16}}/>
            )}
          </Flex>
        ))}
      </Flex>
    </Drawer>
  )
}
