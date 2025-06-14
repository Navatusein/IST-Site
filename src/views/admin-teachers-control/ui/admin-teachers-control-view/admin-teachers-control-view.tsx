"use client"

import {ITeacher} from "@/entities/teacher";
import {Card, Typography} from "antd";
import {TeacherCrud} from "@/widgets/teacher-crud";

interface IProps {
  teachers: ITeacher[];
}

export default function AdminTeachersControlView(props: IProps) {
  return (
    <Card variant="borderless">
      <Typography.Title level={2}>Керування викладачами</Typography.Title>
      <TeacherCrud teachers={props.teachers}/>
    </Card>
  )
}
