"use server"

import {notFound} from "next/navigation";
import {useServerAction} from "@/shared/hooks/use-server-action";
import {getDepartmentStaffByPathAction} from "@/entities/department-staff/actions/actions";
import {DepartmentStaffView} from "@/views/department-staff";


interface IProps {
  params: Promise<{
    path: string;
  }>
}

export default async function Page(props: IProps) {
  const {path} = await props.params;

  const departmentStaff = await useServerAction(getDepartmentStaffByPathAction(path));

  if (!departmentStaff)
    notFound();

  return (
    <DepartmentStaffView departmentStaff={departmentStaff}/>
  )
}