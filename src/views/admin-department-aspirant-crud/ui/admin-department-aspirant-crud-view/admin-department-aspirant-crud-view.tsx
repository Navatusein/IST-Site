"use client"

import {IDepartmentAspirant} from "@/entities/department-aspirant";
import {IDepartmentStaff} from "@/entities/department-staff";
import {Card, Typography} from "antd";
import {DepartmentAspirantCrud} from "@/widgets/department-aspirant-crud";


interface IProps {
  departmentAspirants: IDepartmentAspirant[];
  departmentStaff: IDepartmentStaff[];
}

export default function AdminDepartmentAspirantCrudView(props: IProps) {
  return (
    <Card variant="borderless">
      <Typography.Title level={2}>Аспіранти кафедри</Typography.Title>
      <DepartmentAspirantCrud departmentStaff={props.departmentStaff} departmentAspirants={props.departmentAspirants}/>
    </Card>
  )
}
