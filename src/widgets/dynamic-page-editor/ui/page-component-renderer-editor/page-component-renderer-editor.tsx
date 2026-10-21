import {Card, Flex} from "antd";
import {PageComponentRenderer, PageGroupCell} from "@/entities/dynamic-page/ui";
import {IBasePageComponent, IPageComponentGroup} from "@/entities/dynamic-page";
import {getPageEntityElementId} from "@/entities/dynamic-page/utilities/page-entity-element-id";
import {ReactNode} from "react";
import {ComponentCol, DraggableList} from "@/shared/ui-kit";
import ComponentSettingsDrawer from "../component-settings-drawer/component-settings-drawer";
import EditorTools from "../editor-tools/editor-tools";
import EditorBlockFrame from "../editor-block-frame/editor-block-frame";
import {usePageComponentRegistry} from "@/entities/dynamic-page/model";
import {usePageEditor} from "../../context/page-editor-context";

interface IProps {
  component: IBasePageComponent;
  index: number;
  updateComponent: (value: IBasePageComponent, index: number) => void;
  removeComponent: (index: number) => void;
  allowChangeSize: boolean;
  group?: IPageComponentGroup;
  extraActions?: ReactNode;
}

export default function PageComponentRendererEditor(props: IProps) {
  const name = usePageComponentRegistry().getDescriptor(props.component.componentType)?.name ?? props.component.componentType;

  const editor = usePageEditor();

  const isEditDrawerOpen = editor.editingId == props.component.id;
  const setIsEditDrawerOpen = (isOpen: boolean) => editor.edit(isOpen ? props.component.id : null);

  const view = (
    <PageComponentRenderer
      component={props.component}
      editMode={false}
      inline
    />
  );

  const frame = (
    <EditorBlockFrame
      id={props.component.id}
      label={name}
      fill={props.group != null}
      toolbar={
        <EditorTools
          allowChangeSize={props.allowChangeSize}
          component={props.component}
          index={props.index}
          updateComponent={props.updateComponent}
          removeComponent={props.removeComponent}
          setIsEditDrawerOpen={setIsEditDrawerOpen}
          extraActions={props.extraActions}
        />
      }
    >
      {props.group ? (
        <PageGroupCell group={props.group} style={{flexGrow: 1, height: "auto"}}>
          {view}
        </PageGroupCell>
      ) : view}
      <ComponentSettingsDrawer
        isOpen={isEditDrawerOpen}
        setIsOpen={setIsEditDrawerOpen}
        component={props.component}
        updateComponent={(value) => props.updateComponent(value, props.index)}
      />
    </EditorBlockFrame>
  );

  return (
    <DraggableList.Item
      index={props.index}
      id={getPageEntityElementId(props.component.id)}
      style={{scrollMarginTop: 80}}
      fill={props.group != null}
      renderPreview={() => <Card size="small">{name}</Card>}
    >
      {props.group ? frame : (
        <Flex vertical>
          <ComponentCol width={props.component.width}>
            {frame}
          </ComponentCol>
        </Flex>
      )}
    </DraggableList.Item>
  )
}
