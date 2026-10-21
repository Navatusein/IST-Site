"use client"

import {IDepartmentStaff} from "@/entities/department-staff";
import {useState} from "react";
import {IPageEntity} from "@/entities/dynamic-page";
import {unwrapServerAction} from "@/shared/utilities/unwrap-server-action";
import {updateDepartmentStaffAction} from "@/entities/department-staff/actions/actions";
import {DynamicPageEditor} from "@/widgets/dynamic-page-editor";

interface IProps {
  departmentStaff: IDepartmentStaff
}

export default function AdminDepartmentStaffPageEditView(props: IProps) {
  const [entities, setEntities] = useState<IPageEntity[]>(props.departmentStaff.entities);
  const [recordId, setRecordId] = useState<string>(String(props.departmentStaff._id));

  if (recordId != String(props.departmentStaff._id)) {
    setRecordId(String(props.departmentStaff._id));
    setEntities(props.departmentStaff.entities);
  }

  const saveEntities = async (value: IPageEntity[]) => {
    await unwrapServerAction(updateDepartmentStaffAction({_id: props.departmentStaff._id, entities: value} as Pick<IDepartmentStaff, "_id" | "entities"> as IDepartmentStaff));
  }

  return (
    <DynamicPageEditor
      key={recordId}
      entities={entities}
      setEntities={setEntities}
      saveEntities={saveEntities}
      history={{collection: "department-staff", recordId}}
    />
  )
}
