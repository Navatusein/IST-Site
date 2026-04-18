import {IBasePageComponent, IPageEntity} from "@/entities/dynamic-page";
import {DraggableList} from "@/features/draggable-list";
import {Alert} from "antd";
import {PageComponentRendererEditor} from "@/widgets/page-component-renderer-editor";

interface IProps {
  entities: IPageEntity[];
  updateEntities: (value: IPageEntity[]) => void;
  updateEntity: (value: IPageEntity, index: number) => void;
  removeEntity: (index: number) => void;
}

export default function PageEntityList(props: IProps) {
  return (
    <DraggableList items={props.entities} setItems={props.updateEntities}>
      {props.entities.map((entity, index) => {
        if (entity.type == "group")
          return (
            <Alert type="error" title="Group" key={`page-group-${index}`}/>
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
            />
          )

        return <Alert type="error" title="Unknown page entity" key={`page-error-${index}`}/>
      })}
    </DraggableList>
  )
}
