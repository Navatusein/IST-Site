import {useMemo} from "react";
import {IBasePageComponent} from "@/entities/dynamic-page";
import {PageComponentError} from "@/shared/ui-kit";
import {IDepartmentAspirantListPageComponent} from "../../types/type";

interface IProps {
  componentProps: IBasePageComponent;
  onChange: (value: IBasePageComponent) => void;
}

export default function DepartmentAspirantListEditor(props: IProps) {
  const typedComponentProps = useMemo(() => {
    if (props.componentProps.type !== "department-aspirant-list")
      return null;

    return props.componentProps as IDepartmentAspirantListPageComponent;
  }, [props]);

  return (
    <PageComponentError message={typedComponentProps == null ? "Fail" : ""}>
    </PageComponentError>
  )
}