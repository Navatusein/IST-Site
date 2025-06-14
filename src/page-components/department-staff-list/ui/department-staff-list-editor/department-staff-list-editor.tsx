import {useMemo} from "react";
import {IBasePageComponent} from "@/entities/dynamic-page";
import {PageComponentError} from "@/shared/ui-kit";
import {IDepartmentStaffListPageComponent} from "../../types/type";

interface IProps {
  componentProps: IBasePageComponent;
  onChange: (value: IBasePageComponent) => void;
}

export default function DepartmentStaffListEditor(props: IProps) {
  const typedComponentProps = useMemo(() => {
    if (props.componentProps.type !== "department-staff-list")
      return null;

    return props.componentProps as IDepartmentStaffListPageComponent;
  }, [props]);

  return (
    <PageComponentError message={typedComponentProps == null ? "Fail" : ""}>
    </PageComponentError>
  )
}