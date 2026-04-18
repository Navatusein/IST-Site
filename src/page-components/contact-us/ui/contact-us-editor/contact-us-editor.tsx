import {useMemo} from "react";
import {IBasePageComponent} from "@/entities/dynamic-page";
import {PageComponentError} from "@/shared/ui-kit";
import {IContactUsPageComponent} from "../../types/type";

interface IProps {
  component: IBasePageComponent;
  onChange: (value: IBasePageComponent) => void;
}

export default function ContactUsEditor(props: IProps) {
  const typedComponent = useMemo(() => {
    if (props.component.componentType !== "contact-us")
      return null;

    return props.component as IContactUsPageComponent;
  }, [props]);

  return (
    <PageComponentError component={typedComponent}/>
  )
}