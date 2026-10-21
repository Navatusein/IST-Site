import {useEffect} from "react";
import {Empty, Flex} from "antd";
import {IBasePageComponent, IPageComponentGroup, IPageEntity} from "@/entities/dynamic-page";
import {IPageComponentRegistry, usePageComponentRegistry} from "@/entities/dynamic-page/model";
import {scrollToPageEntity} from "@/entities/dynamic-page/utilities/page-entity-element-id";
import {DraggableList, moveItem} from "@/shared/ui-kit";
import {useActivePageEntity} from "../../hooks/use-active-page-entity";
import {usePageEditor} from "../../context/page-editor-context";
import PageOutlineItem from "../page-outline-item/page-outline-item";

interface IProps {
  entities: IPageEntity[];
  updateEntities: (value: IPageEntity[]) => void;
  topOffset: number;
  onSelect?: () => void;
}

function describeEntity(entity: IPageEntity, registry: IPageComponentRegistry) {
  const getName = (component: IBasePageComponent) => registry.getDescriptor(component.componentType)?.name ?? "Блок";

  if (entity.type == "group")
    return {
      name: (entity as IPageComponentGroup).cards ? "Розмітка з картками" : "Розмітка",
      details: (entity as IPageComponentGroup).components.map(getName).join(", ") || "порожній"
    };

  return {name: getName(entity as IBasePageComponent)};
}

export default function PageOutline(props: IProps) {
  const registry = usePageComponentRegistry();
  const editor = usePageEditor();
  const {activeId, setActiveId} = useActivePageEntity(props.entities, props.topOffset);

  useEffect(() => {
    const entity = props.entities.find((entity) => entity.id == editor.selectedId || (
      entity.type == "group" && (entity as IPageComponentGroup).components.some((component) => component.id == editor.selectedId)
    ));

    if (entity)
      setActiveId(() => entity.id);
  }, [editor.selectedId]);

  const select = (entity: IPageEntity) => {
    scrollToPageEntity(entity.id);
    setActiveId(() => entity.id);
    editor.select(entity.id);
    editor.highlight(null);
    props.onSelect?.();
  }

  if (props.entities.length == 0)
    return <Empty description="Сторінка порожня" image={Empty.PRESENTED_IMAGE_SIMPLE}/>;

  return (
    <DraggableList
      count={props.entities.length}
      onReorder={(startIndex, finishIndex) => props.updateEntities(moveItem(props.entities, startIndex, finishIndex))}
    >
      <Flex vertical gap={2}>
        {props.entities.map((entity, index) => (
          <DraggableList.Item key={entity.id} index={index} gap="2px">
            <PageOutlineItem
              index={index}
              {...describeEntity(entity, registry)}
              isActive={entity.id == activeId}
              onSelect={() => select(entity)}
              onHover={(isHovered) => editor.highlight(isHovered ? entity.id : null)}
            />
          </DraggableList.Item>
        ))}
      </Flex>
    </DraggableList>
  )
}
