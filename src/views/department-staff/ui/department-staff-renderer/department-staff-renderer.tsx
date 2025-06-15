"use client"

import {IDepartmentStaff} from "@/entities/department-staff";
import {Flex, theme} from "antd";
import {PageComponentRenderer} from "@/widgets/page-component-renderer";

interface IProps {
  teacher: IDepartmentStaff;
}

export default function DepartmentStaffRenderer(props: IProps) {
  const {token: {padding}} = theme.useToken();

  return (
    <Flex vertical gap="middle" style={{marginBottom: padding}}>
      {props.teacher.components.map((component, index) => (
        <PageComponentRenderer propsClass={{...component, width: "large"}} key={`component-${index}`}/>
      ))}
    </Flex>
  )
}
