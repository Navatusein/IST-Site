"use client"

import dynamic from "next/dynamic";
import {Loader} from "@/shared/ui-kit";
import {IDepartmentStaff} from "@/entities/department-staff";

interface IProps {
  teacher: IDepartmentStaff;
}

const TeacherRenderer = dynamic(() => import("@/views/department-staff/ui/department-staff-renderer/department-staff-renderer"), {
  ssr: false,
  loading: () => <Loader/>
});

export default function DepartmentStaffView(props: IProps) {
  return (
    <>
      <TeacherRenderer teacher={props.teacher}/>
    </>
  )
}
