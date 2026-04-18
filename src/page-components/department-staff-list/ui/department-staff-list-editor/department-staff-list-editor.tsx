import {useMemo} from "react";
import {IBasePageComponent} from "@/entities/dynamic-page";
import {PageComponentError} from "@/shared/ui-kit";
import {IDepartmentStaffListPageComponent} from "../../types/type";

interface IProps {
  component: IBasePageComponent;
  onChange: (value: IBasePageComponent) => void;
}

export default function DepartmentStaffListEditor(props: IProps) {
  const typedComponent = useMemo(() => {
    if (props.component.componentType !== "department-staff-list")
      return null;

    return props.component as IDepartmentStaffListPageComponent;
  }, [props]);

  return (
    <PageComponentError component={typedComponent}>
    </PageComponentError>
  )
}