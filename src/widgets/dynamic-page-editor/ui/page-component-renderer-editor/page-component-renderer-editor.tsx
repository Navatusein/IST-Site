import {Card, Flex, theme} from "antd";
import {PageComponentRenderer} from "@/entities/dynamic-page/ui";
import {IBasePageComponent} from "@/entities/dynamic-page";
import {getPageEntityElementId} from "@/entities/dynamic-page/utilities/page-entity-element-id";
import {ReactNode, useState} from "react";
import {DraggableList} from "@/shared/ui-kit";
import ComponentSettingsDrawer from "../component-settings-drawer/component-settings-drawer";
import EditorTools from "../editor-tools/editor-tools";
import {usePageComponentRegistry} from "@/entities/dynamic-page/model";

interface IProps {
  component: IBasePageComponent;
  index: number;
  updateComponent: (value: IBasePageComponent, index: number) => void;
  removeComponent: (index: number) => void;
  allowChangeSize: boolean;
  inline?: boolean;
  extraActions?: ReactNode;
}

export default function PageComponentRendererEditor(props: IProps) {
  const {token: {paddingXS}} = theme.useToken();

  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState<boolean>(false);

  return (
    <DraggableList.Item
      index={props.index}
      id={getPageEntityElementId(props.component.id)}
      style={{scrollMarginTop: 80}}
      renderPreview={() => (
        <DragPreview component={props.component}/>
      )}
    >
      <Flex vertical style={{marginBottom: paddingXS}}>
        <PageComponentRenderer
          component={props.component}
          editMode={false}
          inline={props.inline}
        />
        <EditorTools
          allowChangeSize={props.allowChangeSize}
          component={props.component}
          index={props.index}
          updateComponent={props.updateComponent}
          removeComponent={props.removeComponent}
          setIsEditDrawerOpen={setIsEditDrawerOpen}
          compact={props.inline}
          extraActions={props.extraActions}
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
  const name = usePageComponentRegistry().getDescriptor(props.component.componentType)?.name ?? props.component.componentType;

  return <Card size="small">{name}</Card>;
}