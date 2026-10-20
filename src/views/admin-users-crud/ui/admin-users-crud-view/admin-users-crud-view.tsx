"use client"

import {Card, Typography} from "antd";
import type {IUser} from "@/entities/user";
import {IPageResult} from "@/shared/types/page-query";
import UserCrud from "../user-crud/user-crud";

interface IProps {
  result: IPageResult<IUser>;
}

export default function AdminUsersCrudView(props: IProps) {
  return (
    <Card variant="borderless">
      <Typography.Title level={2}>Користувачі</Typography.Title>
      <UserCrud result={props.result}/>
    </Card>
  )
}
