import {Button, Col, Divider, Drawer, Flex, Row, Typography} from "antd";
import {IPageEntity} from "@/entities/dynamic-page";
import {EmptyPageComponentGroup} from "@/entities/dynamic-page/types/type";
import {AnyPageComponentDescriptor, createPageComponent, usePageComponentRegistry} from "@/entities/dynamic-page/model";

interface IProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  addEntity: (value: IPageEntity) => void;
  title?: string;
  showGroupComponent?: boolean;
  filter?: (descriptor: AnyPageComponentDescriptor) => boolean;
}

interface IOption {
  key: string;
  name: string;
  create: () => IPageEntity;
}

interface ISection {
  name: string;
  title: string;
  description: string;
  options: IOption[];
}

export default function AddPageComponentDrawer(props: IProps) {
  const registry = usePageComponentRegistry();
  const addEntity = (option: IOption) => {
    props.addEntity(option.create());
    props.setIsOpen(false);
  }

  const sections: ISection[] = [
    ...(props.showGroupComponent ? [{
      name: "layout",
      title: "Розмітка",
      description: "Розміщення кількох блоків поруч",
      options: [{
        key: "group",
        name: "Ряд",
        create: () => structuredClone(EmptyPageComponentGroup)
      }]
    }] : []),
    ...registry.categories.map((category) => ({
      name: category.name,
      title: category.title,
      description: category.description,
      options: registry.components
        .filter((descriptor) => descriptor.category == category.name && (props.filter?.(descriptor) ?? true))
        .map((descriptor) => ({
          key: descriptor.type,
          name: descriptor.name,
          create: () => createPageComponent(descriptor)
        }))
    })),
  ].filter((section) => section.options.length != 0);

  return (
    <Drawer
      open={props.isOpen}
      onClose={() => props.setIsOpen(false)}
      size="large"
      title={props.title ?? "Додати новий блок"}
    >
      <Flex vertical gap="middle">
        {sections.map((section, sectionIndex) => (
          <Flex vertical gap="small" key={`section-${section.name}`}>
            <Flex vertical>
              <Typography.Title level={5} style={{margin: 0}}>
                {section.title}
              </Typography.Title>
              <Typography.Text>
                {section.description}
              </Typography.Text>
            </Flex>
            <Row gutter={[8, 8]}>
              {section.options.map((option) => (
                <Col span={12} key={`option-${option.key}`}>
                  <Button
                    style={{padding: "10px", height: "100%", width: "100%"}}
                    onClick={() => addEntity(option)}
                  >
                    <Flex vertical style={{height: "100%", width: "100%"}}>
                      <Typography.Text strong ellipsis>
                        {option.name}
                      </Typography.Text>
                    </Flex>
                  </Button>
                </Col>
              ))}
            </Row>
            {sectionIndex != sections.length - 1 && (
              <Divider style={{marginBottom: 0, marginTop: 16}}/>
            )}
          </Flex>
        ))}
      </Flex>
    </Drawer>
  )
}
