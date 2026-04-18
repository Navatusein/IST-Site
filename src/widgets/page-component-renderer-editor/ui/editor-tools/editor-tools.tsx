import {App, Button, Card, Flex, Segmented, theme, Tooltip} from "antd";
import {DeleteOutlined, EditOutlined, HolderOutlined} from "@ant-design/icons";
import {IBasePageComponent} from "@/entities/dynamic-page";
import {RefObject} from "react";

interface IProps {
  allowChangeSize: boolean;
  component: IBasePageComponent;
  index: number;
  updateComponent: (value: IBasePageComponent, index: number) => void;
  removeComponent: (index: number) => void;
  setIsEditDrawerOpen: (open: boolean) => void;
  dragHandleRef: RefObject<HTMLButtonElement | null>
}

export default function EditorTools(props: IProps) {
  const {token: {paddingXS}} = theme.useToken();
  const {modal} = App.useApp();

  const onRemove = () => {
    modal.confirm({
      title: "Видалити",
      content: "Ви впевнені що хочете видалити цей блок?",
      okText: "Так",
      cancelText: "Ні",
      onOk: () => {
        props.removeComponent(props.index)
      }
    })
  }

  return (
    <Card variant="borderless" size="small" style={{width: "fit-content", marginTop: paddingXS, alignSelf: "center"}}>
      <Flex gap="small" wrap justify="center">
        <Button ref={props.dragHandleRef} icon={<HolderOutlined/>}/>
        <Tooltip title="Редагувати блок">
          <Button icon={<EditOutlined/>} onClick={() => props.setIsEditDrawerOpen(true)}>
            Редагувати
          </Button>
        </Tooltip>
        {props.allowChangeSize && (
          <Tooltip title="Змінити розмір блоку">
            <Segmented
              options={[
                {value: "large", label: "Великий", disabled: props.component.allowedWidth?.includes("large") == false},
                {value: "medium", label: "Середній", disabled: props.component.allowedWidth?.includes("medium") == false},
                {value: "small", label: "Малий", disabled: props.component.allowedWidth?.includes("small") == false},
              ]}
              value={props.component.width}
              onChange={(value) => props.updateComponent({...props.component, width: value as never}, props.index)}
            />
          </Tooltip>
        )}
        <Tooltip title="Видалити блок">
          <Button danger icon={<DeleteOutlined/>} onClick={onRemove}>
            Видалити
          </Button>
        </Tooltip>
      </Flex>
    </Card>
  )
}
