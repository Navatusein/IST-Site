import {App, Button, Card, Flex, Tooltip} from "antd";
import {PageComponentRenderer} from "@/widgets/page-component-renderer";
import {DeleteOutlined, HolderOutlined} from "@ant-design/icons";
import {IBasePageComponent} from "@/entities/dynamic-page";
import {useRef} from "react";
import {DraggableList} from "@/features/draggable-list";

interface IProps {
  component: IBasePageComponent;
  index: number;
  editMode: boolean;
  updateComponent: (value: IBasePageComponent, index: number) => void;
  removeComponent: (index: number) => void;
}

export default function PageComponentEditor(props: IProps) {
  const {modal} = App.useApp();
  const dragHandleRef = useRef<HTMLButtonElement>(null);

  const onRemove = () => {
    modal.confirm({
      title: "Видалити",
      content: "Ви впевнені що хочите видалити цей блок ?",
      okText: "Так",
      cancelText: "Ні",
      onOk: () => {
        props.removeComponent(props.index)
      }
    })
  }

  return (
    <DraggableList.Item
      item={props.component}
      index={props.index}
      dragHandlerRef={dragHandleRef}
      renderPreview={(component) => (
        <DragPreview component={component}/>
      )}
    >
      <Flex vertical gap={props.editMode ? "small" : "unset"}>
        <PageComponentRenderer
          propsClass={props.component}
          editMode={props.editMode}
          onChange={(value) => props.updateComponent(value, props.index)}
        />
        <Card variant="borderless" size="small" style={{width: "fit-content"}}>
          <Flex gap="small">
            <Button ref={dragHandleRef} type="text" icon={<HolderOutlined/>}/>
            <Tooltip title="Видалити блок">
              <Button danger icon={<DeleteOutlined/>} onClick={onRemove}>
                Видалити
              </Button>
            </Tooltip>
          </Flex>
        </Card>
      </Flex>
    </DraggableList.Item>
  )
}

function DragPreview(props: {component: IBasePageComponent}) {
  return <Card size="small">{props.component.type}</Card>;
}
