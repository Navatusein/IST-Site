import {useMemo} from "react";
import {IBasePageComponent} from "@/entities/dynamic-page";
import {PageComponentError} from "@/shared/ui-kit";
import {IDepartmentAspirantListPageComponent} from "../../types/type";

interface IProps {
  component: IBasePageComponent;
  onChange: (value: IBasePageComponent) => void;
}

export default function DepartmentAspirantListEditor(props: IProps) {
  const typedComponent = useMemo(() => {
    if (props.component.componentType !== "department-aspirant-list")
      return null;

    return props.component as IDepartmentAspirantListPageComponent;
  }, [props]);

  return (
    <PageComponentError component={typedComponent}/>
  )
}