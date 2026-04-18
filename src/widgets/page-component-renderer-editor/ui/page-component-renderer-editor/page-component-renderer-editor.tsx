import {Card, Flex, theme} from "antd";
import {PageComponentRenderer} from "@/widgets/page-component-renderer";
import {IBasePageComponent} from "@/entities/dynamic-page";
import {useRef, useState} from "react";
import {DraggableList} from "@/features/draggable-list";
import ComponentSettingsDrawer from "../component-settings-drawer/component-settings-drawer";
import EditorTools from "../editor-tools/editor-tools";

interface IProps {
  component: IBasePageComponent;
  index: number;
  updateComponent: (value: IBasePageComponent, index: number) => void;
  removeComponent: (index: number) => void;
  horizontal?: boolean;
  allowChangeSize: boolean;
}

export default function PageComponentRendererEditor(props: IProps) {
  const {token: {paddingXS}} = theme.useToken();
  const dragHandleRef = useRef<HTMLButtonElement>(null);

  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState<boolean>(false);

  return (
    <DraggableList.Item
      item={props.component}
      index={props.index}
      dragHandlerRef={dragHandleRef}
      renderPreview={(component) => (
        <DragPreview component={component}/>
      )}
      horizontal={props.horizontal}
    >
      <Flex vertical style={{marginBottom: paddingXS}}>
        <PageComponentRenderer
          component={props.component}
          editMode={false}
        />
        <EditorTools
          allowChangeSize={props.allowChangeSize}
          component={props.component}
          index={props.index}
          updateComponent={props.updateComponent}
          removeComponent={props.removeComponent}
          setIsEditDrawerOpen={setIsEditDrawerOpen}
          dragHandleRef={dragHandleRef}
        />
      </Flex>
      <ComponentSettingsDrawer
        isOpen={isEditDrawerOpen}
        setIsOpen={setIsEditDrawerOpen}
        component={props.component}
        updateComponent={(value) => props.updateComponent(value, props.index)}
      />
    </DraggableList.Item>
  )
}

function DragPreview(props: {component: IBasePageComponent}) {
  return <Card size="small">{props.component.componentType}</Card>;
}