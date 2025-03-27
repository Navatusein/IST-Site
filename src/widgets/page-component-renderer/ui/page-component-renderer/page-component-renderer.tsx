import {TextPageComponent} from "@/widgets/text-page-component";
import {IBasePageComponent} from "@/entities/base-page-component";
import {JSX} from "react";


interface IComponent {
  [key: string]: {
    render: (propsClass: IBasePageComponent) => JSX.Element;
  }
}

let COMPONENT_TYPES: IComponent = {
  "text": {
    "render": (propsClass: IBasePageComponent) => <TextPageComponent propsClass={propsClass}/>
  }
}

interface IProps {
  propsClass: IBasePageComponent
}

export default function PageComponentRenderer(props: IProps) {
  const component = COMPONENT_TYPES[props.propsClass.type];

  if (component == null)
    return <>Not found</>

  return component.render(props.propsClass);
}