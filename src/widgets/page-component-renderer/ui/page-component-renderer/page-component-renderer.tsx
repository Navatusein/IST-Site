import {IBasePageComponent} from "@/entities/dynamic-page";
import {componentTypes} from "@/page-components";

interface IProps {
  editMode?: boolean;
  propsClass: IBasePageComponent;
  onChange?: (value: IBasePageComponent) => void;
}

export default function PageComponentRenderer(props: IProps) {
  const component = componentTypes[props.propsClass.type];

  if (component == null)
    return <>Not found</>

  if (props.editMode == true)
    return component.renderEditor(props.propsClass, props.onChange!)

  return component.renderComponent(props.propsClass);
}