"use client"

import {IDepartmentStaff} from "@/entities/department-staff";
import {useEffect, useState} from "react";
import {IBasePageComponent} from "@/entities/dynamic-page";
import {useServerAction} from "@/shared/hooks/use-server-action";
import {updateDepartmentStaffAction} from "@/entities/department-staff/actions/actions";
import {DynamicPageEditor} from "@/widgets/dynamic-page-editor";

interface IProps {
  departmentStaff: IDepartmentStaff
}

export default function AdminDepartmentStaffPageEditView(props: IProps) {
  const [departmentStaff, setDepartmentStaff] = useState<IDepartmentStaff>(props.departmentStaff);

  useEffect(() => {
    setDepartmentStaff(() => props.departmentStaff);
  }, [props.departmentStaff]);

  const setComponents = (components: IBasePageComponent[]) => {
    setDepartmentStaff((prevState) => (
      {...prevState, components: components} as IDepartmentStaff
    ));
  }

  const saveComponents = async () => {
    await useServerAction(updateDepartmentStaffAction(departmentStaff));
  }

  return (
    <DynamicPageEditor
      entities={departmentStaff.components}
      setEntities={setComponents}
      saveEntities={saveComponents}
    />
  )
}
