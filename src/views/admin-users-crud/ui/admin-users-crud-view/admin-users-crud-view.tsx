"use client"

import {IUser} from "@/entities/user";
import UserCrud from "../user-crud/user-crud";
import {Card, Typography} from "antd";

interface IProps {
  users: IUser[];
}

export default function AdminUsersCrudView(props: IProps) {
  return (
    <Card variant="borderless">
      <Typography.Title level={2}>Користувачі</Typography.Title>
      <UserCrud users={props.users}/>
    </Card>
  )
}
