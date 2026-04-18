"use client"

import {IDepartmentStaff} from "@/entities/department-staff";
import {useEffect, useState} from "react";
import {IPageEntity} from "@/entities/dynamic-page";
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

  const setEntities = (components: IPageEntity[]) => {
    setDepartmentStaff((prevState) => (
      {...prevState, entities: components} as IDepartmentStaff
    ));
  }

  const saveEntities = async () => {
    await useServerAction(updateDepartmentStaffAction(departmentStaff));
  }

  return (
    <DynamicPageEditor
      entities={departmentStaff.entities}
      setEntities={setEntities}
      saveEntities={saveEntities}
    />
  )
}
