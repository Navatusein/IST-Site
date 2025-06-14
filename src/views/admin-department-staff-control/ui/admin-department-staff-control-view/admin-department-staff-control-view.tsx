"use client"

import {IDepartmentStaff} from "@/entities/department-staff";
import {Card, Typography} from "antd";
import {DepartmentStaffCrud} from "@/widgets/department-staff-crud";

interface IProps {
  teachers: IDepartmentStaff[];
}

export default function AdminDepartmentStaffControlView(props: IProps) {
  return (
    <Card variant="borderless">
      <Typography.Title level={2}>Керування викладачами</Typography.Title>
      <DepartmentStaffCrud teachers={props.teachers}/>
    </Card>
  )
}
