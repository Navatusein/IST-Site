import {App, Button, Card, Flex, Segmented, theme, Tooltip} from "antd";
import {PageComponentRenderer} from "@/widgets/page-component-renderer";
import {ArrowsAltOutlined, DeleteOutlined, EditOutlined, HolderOutlined, ShrinkOutlined,} from "@ant-design/icons";
import {IBasePageComponent} from "@/entities/dynamic-page";
import {useRef, useState} from "react";
import {DraggableList} from "@/features/draggable-list";
import PageComponentEditorModal
  from "@/widgets/dynamic-page-editor/ui/page-component-editor-modal/page-component-editor-modal";

interface IProps {
  component: IBasePageComponent;
  index: number;
  editMode: boolean;
  updateComponent: (value: IBasePageComponent, index: number) => void;
  removeComponent: (index: number) => void;
}

export default function PageComponentEditor(props: IProps) {
  const {token: {paddingXS}} = theme.useToken();
  const {modal} = App.useApp();
  const dragHandleRef = useRef<HTMLButtonElement>(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);

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
      <Flex vertical style={{marginBottom: paddingXS}}>
        <PageComponentRenderer
          propsClass={props.component}
          editMode={false}
        />
        <Card variant="borderless" size="small" style={{width: "fit-content", marginTop: paddingXS, alignSelf: "center"}}>
          <Flex gap="small">
            <Button ref={dragHandleRef} type="text" icon={<HolderOutlined/>}/>
            <Tooltip title="Редагувати блок">
              <Button icon={<EditOutlined/>} onClick={() => setIsEditModalOpen(true)}>
                Редагувати
              </Button>
            </Tooltip>
            <Tooltip title="Змінити розмір блоку">
              <Segmented
                options={[
                  {value: "large", icon: <ArrowsAltOutlined/>, label: "Великий", disabled: props.component.allowedWidth == "medium"},
                  {value: "medium", icon: <ShrinkOutlined/>, label: "Середній", disabled: props.component.allowedWidth == "large"}
                ]}
                value={props.component.width}
                onChange={(value) => props.updateComponent({...props.component, width: value as never}, props.index)}
              />
            </Tooltip>
            <Tooltip title="Видалити блок">
              <Button danger icon={<DeleteOutlined/>} onClick={onRemove}>
                Видалити
              </Button>
            </Tooltip>
          </Flex>
        </Card>
      </Flex>
      <PageComponentEditorModal
        isModalOpen={isEditModalOpen}
        setIsModalOpen={setIsEditModalOpen}
        component={props.component}
        updateComponent={(value) => props.updateComponent(value, props.index)}
      />
    </DraggableList.Item>
  )
}

function DragPreview(props: {component: IBasePageComponent}) {
  return <Card size="small">{props.component.type}</Card>;
}
