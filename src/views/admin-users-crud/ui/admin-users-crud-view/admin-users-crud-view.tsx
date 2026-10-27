"use client"

import {Card} from "antd";
import fillHeight from "@/shared/styles/fill-height.module.scss";
import type {IUser} from "@/entities/user";
import {IPageResult} from "@/shared/types/page-query";
import UserCrud from "../user-crud/user-crud";

interface IProps {
  result: IPageResult<IUser>;
}

export default function AdminUsersCrudView(props: IProps) {
  return (
    <Card variant="borderless" className={fillHeight.page}>
      <UserCrud result={props.result}/>
    </Card>
  )
}
