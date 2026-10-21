import {App, Button, Tooltip} from "antd";
import {DeleteOutlined, EditOutlined} from "@ant-design/icons";
import {ReactNode} from "react";
import {IBasePageComponent} from "@/entities/dynamic-page";
import {DraggableList} from "@/shared/ui-kit";
import {usePageComponentRegistry} from "@/entities/dynamic-page/model";
import WidthControl from "../width-control/width-control";

interface IProps {
  allowChangeSize: boolean;
  component: IBasePageComponent;
  index: number;
  updateComponent: (value: IBasePageComponent, index: number) => void;
  removeComponent: (index: number) => void;
  setIsEditDrawerOpen: (open: boolean) => void;
  extraActions?: ReactNode;
}

export default function EditorTools(props: IProps) {
  const {modal} = App.useApp();

  const allowedWidth = usePageComponentRegistry().getDescriptor(props.component.componentType)?.allowedWidth;

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
    <>
      <DraggableList.Handle size="small"/>
      <Tooltip title="Редагувати блок">
        <Button type="text" size="small" icon={<EditOutlined/>} onClick={() => props.setIsEditDrawerOpen(true)} aria-label="Редагувати блок"/>
      </Tooltip>
      {props.allowChangeSize && (
        <WidthControl
          value={props.component.width}
          onChange={(width) => props.updateComponent({...props.component, width}, props.index)}
          allowedWidth={allowedWidth}
          compact
          size="small"
          type="text"
          tooltip="Змінити розмір блоку"
        />
      )}
      {props.extraActions}
      <Tooltip title="Видалити блок">
        <Button type="text" size="small" danger icon={<DeleteOutlined/>} onClick={onRemove} aria-label="Видалити блок"/>
      </Tooltip>
    </>
  )
}
