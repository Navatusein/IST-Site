"use client"

import {IDepartmentStaff} from "@/entities/department-staff";
import {Card, Typography} from "antd";
import {DepartmentStaffCrud} from "@/widgets/department-staff-crud";

interface IProps {
  departmentStaff: IDepartmentStaff[];
}

export default function AdminDepartmentStaffCrudView(props: IProps) {
  return (
    <Card variant="borderless">
      <Typography.Title level={2}>Керування викладачами</Typography.Title>
      <DepartmentStaffCrud departmentStaff={props.departmentStaff}/>
    </Card>
  )
}
