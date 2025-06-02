import {IBasePageComponent} from "@/entities/dynamic-page";
import PageComponentEditor from "../page-component-editor/page-component-editor";
import {DraggableList} from "@/features/draggable-list";

interface IProps {
  components: IBasePageComponent[];
  updateComponents: (value: IBasePageComponent[]) => void;
  updateComponent: (value: IBasePageComponent, index: number) => void;
  removeComponent: (index: number) => void;
}

export default function PageComponentList(props: IProps) {
  return (
    <DraggableList items={props.components} setItems={props.updateComponents}>
      {props.components.map((component, index) => (
        <PageComponentEditor
          key={component.id}
          component={component}
          index={index}
          updateComponent={props.updateComponent}
          removeComponent={props.removeComponent}
        />
      ))}
    </DraggableList>
  )
}
