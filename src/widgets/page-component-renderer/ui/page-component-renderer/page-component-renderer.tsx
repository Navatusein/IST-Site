// "use client"

import {TextPageComponent} from "@/widgets/text-page-component";
import {ComponentDescriptorType} from "../../types/type";
import {IBasePageComponent} from "@/entities/dynamic-page";

export const COMPONENT_TYPES: ComponentDescriptorType = {
  "text": {
    "renderComponent": (propsClass) => <TextPageComponent propsClass={propsClass}/>,
    "renderEditor": (propsClass, onChange) => <TextPageComponent.Editor propsClass={propsClass} onChange={onChange}/>
  }
}

interface IProps {
  editMode?: boolean;
  propsClass: IBasePageComponent;
  onChange?: (value: IBasePageComponent) => void;
}

export default function PageComponentRenderer(props: IProps) {
  const component = COMPONENT_TYPES[props.propsClass.type];

  if (component == null)
    return <>Not found</>

  if (props.editMode == true)
    return component.renderEditor(props.propsClass, props.onChange!)

  return component.renderComponent(props.propsClass);
}