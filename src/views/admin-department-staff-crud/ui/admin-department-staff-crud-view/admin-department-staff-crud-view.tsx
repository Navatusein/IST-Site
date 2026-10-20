"use client"

import {Card, Typography} from "antd";
import type {IDepartmentStaff} from "@/entities/department-staff";
import {IPageResult} from "@/shared/types/page-query";
import DepartmentStaffCrud from "../department-staff-crud/department-staff-crud";

interface IProps {
  result: IPageResult<IDepartmentStaff>;
}

export default function AdminDepartmentStaffCrudView(props: IProps) {
  return (
    <Card variant="borderless">
      <Typography.Title level={2}>Співробітники кафедри</Typography.Title>
      <DepartmentStaffCrud result={props.result}/>
    </Card>
  )
}
