import {App, Button, Card, Flex, Grid, theme, Tooltip} from "antd";
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
  compact?: boolean;
  extraActions?: ReactNode;
}

export default function EditorTools(props: IProps) {
  const {token: {paddingXS}} = theme.useToken();
  const {modal} = App.useApp();

  const isNarrow = Grid.useBreakpoint().md != true;

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
    <Card variant="borderless" size="small" style={{width: "fit-content", maxWidth: "100%", marginTop: paddingXS, alignSelf: "center"}}>
      <Flex gap={isNarrow ? 6 : "small"} wrap justify="center">
        <DraggableList.Handle type="default"/>
        <Tooltip title="Редагувати блок">
          <Button icon={<EditOutlined/>} onClick={() => props.setIsEditDrawerOpen(true)} aria-label="Редагувати блок">
            {!isNarrow && "Редагувати"}
          </Button>
        </Tooltip>
        {props.allowChangeSize && (
          <WidthControl
            value={props.component.width}
            onChange={(width) => props.updateComponent({...props.component, width}, props.index)}
            allowedWidth={allowedWidth}
            compact={isNarrow}
            tooltip="Змінити розмір блоку"
          />
        )}
        {props.extraActions}
        <Tooltip title="Видалити блок">
          <Button danger icon={<DeleteOutlined/>} onClick={onRemove} aria-label="Видалити блок">
            {!props.compact && !isNarrow && "Видалити"}
          </Button>
        </Tooltip>
      </Flex>
    </Card>
  )
}
