"use server"

import {notFound} from "next/navigation";
import {useServerAction} from "@/shared/hooks/use-server-action";
import {getTeacherByPathAction} from "@/entities/teacher/actions/actions";
import {AdminEditTeacherView} from "@/views/admin-edit-teacher";

interface IProps {
  params: Promise<{
    path: string;
  }>
}

export default async function Page(props: IProps) {
  const {path} = await props.params;

  const teacher = await useServerAction(getTeacherByPathAction(path));

  if (!teacher)
    notFound();

  return (
    <AdminEditTeacherView teacher={teacher}/>
  )
}