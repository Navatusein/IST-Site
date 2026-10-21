import {Alert, Button, Dropdown, Flex, MenuProps, theme, Tooltip} from "antd";
import {ImportOutlined} from "@ant-design/icons";
import {IBasePageComponent, IPageComponentGroup, IPageEntity} from "@/entities/dynamic-page";
import {MAX_PAGE_GROUP_COMPONENTS} from "@/entities/dynamic-page/types/type";
import {DraggableList, moveItem} from "@/shared/ui-kit";
import {usePageComponentRegistry} from "@/entities/dynamic-page/model";
import PageComponentRendererEditor from "../page-component-renderer-editor/page-component-renderer-editor";
import PageGroupEditor from "../page-group-editor/page-group-editor";
import {toGroupCell} from "../../model/page-group-cells";

interface IProps {
  entities: IPageEntity[];
  updateEntities: (value: IPageEntity[]) => void;
  updateEntity: (value: IPageEntity, index: number) => void;
  removeEntity: (index: number) => void;
  replaceEntity: (index: number, entities: IPageEntity[]) => void;
}

export default function PageEntityList(props: IProps) {
  const registry = usePageComponentRegistry();

  const {token: {paddingLG}} = theme.useToken();

  const isRowWithSpace = (entity?: IPageEntity): entity is IPageComponentGroup => (
    entity?.type == "group" && (entity as IPageComponentGroup).components.length < MAX_PAGE_GROUP_COMPONENTS
  );

  const moveIntoRow = (componentIndex: number, rowIndex: number) => {
    const component = props.entities[componentIndex] as IBasePageComponent;
    const row = props.entities[rowIndex] as IPageComponentGroup;

    props.updateEntities(props.entities
      .map((entity, index) => index == rowIndex ? {...row, components: [...row.components, toGroupCell(component, row.components)]} : entity)
      .filter((_, index) => index != componentIndex)
    );
  }

  const renderMoveIntoRow = (component: IBasePageComponent, index: number) => {
    if (!registry.getDescriptor(component.componentType)?.allowInRow)
      return null;

    const items: MenuProps["items"] = [];

    if (isRowWithSpace(props.entities[index - 1]))
      items.push({key: "above", label: "У розмітку вище", onClick: () => moveIntoRow(index, index - 1)});

    if (isRowWithSpace(props.entities[index + 1]))
      items.push({key: "below", label: "У розмітку нижче", onClick: () => moveIntoRow(index, index + 1)});

    if (items.length == 0)
      return null;

    return (
      <Dropdown menu={{items}} trigger={["click"]}>
        <Tooltip title="Перемістити блок у сусідню розмітку">
          <Button type="text" size="small" icon={<ImportOutlined/>} aria-label="Перемістити блок у сусідню розмітку"/>
        </Tooltip>
      </Dropdown>
    );
  }

  return (
    <DraggableList
      count={props.entities.length}
      onReorder={(startIndex, finishIndex) => props.updateEntities(moveItem(props.entities, startIndex, finishIndex))}
    >
      <Flex vertical gap={paddingLG}>
        {props.entities.map((entity, index) => {
          if (entity.type == "group")
            return (
              <PageGroupEditor
                key={entity.id}
                group={entity as IPageComponentGroup}
                index={index}
                updateEntity={props.updateEntity}
                removeEntity={props.removeEntity}
                replaceEntity={props.replaceEntity}
              />
            );

          if (entity.type == "component")
            return (
              <PageComponentRendererEditor
                key={entity.id}
                component={entity as IBasePageComponent}
                index={index}
                updateComponent={props.updateEntity}
                removeComponent={props.removeEntity}
                allowChangeSize={true}
                extraActions={renderMoveIntoRow(entity as IBasePageComponent, index)}
              />
            )

          return <Alert type="error" title="Unknown page entity" key={`page-error-${index}`}/>
        })}
      </Flex>
    </DraggableList>
  )
}
