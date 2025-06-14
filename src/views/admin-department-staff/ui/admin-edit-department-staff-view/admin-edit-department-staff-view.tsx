"use client"

import {IDepartmentStaff} from "@/entities/department-staff";
import {useEffect, useState} from "react";
import {IBasePageComponent} from "@/entities/dynamic-page";
import {useServerAction} from "@/shared/hooks/use-server-action";
import {updateDepartmentStaffAction} from "@/entities/department-staff/actions/actions";
import {DynamicPageEditor} from "@/widgets/dynamic-page-editor";

interface IProps {
  teacher: IDepartmentStaff
}

export default function AdminEditDepartmentStaffView(props: IProps) {
  const [teacher, setTeacher] = useState<IDepartmentStaff>(props.teacher);

  useEffect(() => {
    setTeacher(() => props.teacher);
  }, [props.teacher]);

  const setComponents = (components: IBasePageComponent[]) => {
    setTeacher((prevState) => (
      {...prevState, components: components} as IDepartmentStaff
    ));
  }

  const saveComponents = async () => {
    await useServerAction(updateDepartmentStaffAction(teacher));
  }

  return (
    <DynamicPageEditor
      components={teacher.components}
      setComponents={setComponents}
      saveComponents={saveComponents}
    />
  )
}
