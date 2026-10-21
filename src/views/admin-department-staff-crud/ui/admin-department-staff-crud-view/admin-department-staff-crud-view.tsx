"use client"

import {Card} from "antd";
import type {IDepartmentStaff} from "@/entities/department-staff";
import {IPageResult} from "@/shared/types/page-query";
import DepartmentStaffCrud from "../department-staff-crud/department-staff-crud";

interface IProps {
  result: IPageResult<IDepartmentStaff>;
}

export default function AdminDepartmentStaffCrudView(props: IProps) {
  return (
    <Card variant="borderless">
      <DepartmentStaffCrud result={props.result}/>
    </Card>
  )
}
