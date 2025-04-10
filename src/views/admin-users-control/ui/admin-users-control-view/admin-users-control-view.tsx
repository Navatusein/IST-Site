"use client"

import {IUser} from "@/entities/user";
import {UserCrud} from "@/widgets/user-crud";
import {Card, Typography} from "antd";

interface IProps {
  users: IUser[];
}

export default function AdminUsersControlView(props: IProps) {
  return (
    <Card variant="borderless">
      <Typography.Title level={2}>Керування користувачами</Typography.Title>
      <UserCrud users={props.users}/>
    </Card>
  )
}
