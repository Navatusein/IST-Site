"use server"

import {notFound} from "next/navigation";
import {unwrapServerAction} from "@/shared/utilities/unwrap-server-action";
import {getDepartmentStaffByPathAction} from "@/entities/department-staff/actions/actions";
import {AdminDepartmentStaffPageEditView} from "@/views/admin-department-staff-page-edit";

interface IProps {
  params: Promise<{
    path: string;
  }>
}

export default async function Page(props: IProps) {
  const {path} = await props.params;

  const teacher = await unwrapServerAction(getDepartmentStaffByPathAction(path));

  if (!teacher)
    notFound();

  return (
    <AdminDepartmentStaffPageEditView departmentStaff={teacher}/>
  )
}