"use client"

import {Card} from "antd";
import type {IDepartmentAspirant} from "@/entities/department-aspirant";
import type {IDepartmentStaff} from "@/entities/department-staff";
import {IPageResult} from "@/shared/types/page-query";
import DepartmentAspirantCrud from "../department-aspirant-crud/department-aspirant-crud";

interface IProps {
  result: IPageResult<IDepartmentAspirant>;
  departmentStaff: IDepartmentStaff[];
}

export default function AdminDepartmentAspirantCrudView(props: IProps) {
  return (
    <Card variant="borderless">
      <DepartmentAspirantCrud result={props.result} departmentStaff={props.departmentStaff}/>
    </Card>
  )
}
