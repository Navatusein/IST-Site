import {useMemo} from "react";
import {IBasePageComponent} from "@/entities/dynamic-page";
import {PageComponentError} from "@/shared/ui-kit";
import {IContactUsPageComponent} from "../../types/type";

interface IProps {
  componentProps: IBasePageComponent;
  onChange: (value: IBasePageComponent) => void;
}

export default function ContactUsEditor(props: IProps) {
  const typedComponentProps = useMemo(() => {
    if (props.componentProps.type !== "contact-us")
      return null;

    return props.componentProps as IContactUsPageComponent;
  }, [props]);

  return (
    <PageComponentError message={typedComponentProps == null ? "Fail" : ""}>
    </PageComponentError>
  )
}