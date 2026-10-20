import {Empty, Flex} from "antd";
import {IBasePageComponent, IPageComponentGroup, IPageEntity} from "@/entities/dynamic-page";
import {IPageComponentRegistry, usePageComponentRegistry} from "@/entities/dynamic-page/model";
import {scrollToPageEntity} from "@/entities/dynamic-page/utilities/page-entity-element-id";
import {DraggableList, moveItem} from "@/shared/ui-kit";
import {useActivePageEntity} from "../../model/use-active-page-entity";
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
      name: "Ряд",
      details: (entity as IPageComponentGroup).components.map(getName).join(", ") || "порожній"
    };

  return {name: getName(entity as IBasePageComponent)};
}

export default function PageOutline(props: IProps) {
  const registry = usePageComponentRegistry();
  const {activeId, setActiveId} = useActivePageEntity(props.entities, props.topOffset);

  const select = (entity: IPageEntity) => {
    scrollToPageEntity(entity.id);
    setActiveId(() => entity.id);
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
            />
          </DraggableList.Item>
        ))}
      </Flex>
    </DraggableList>
  )
}
