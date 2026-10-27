"use client"

import Link from "next/link";
import {usePathname} from "next/navigation";
import {Button, theme} from "antd";
import {EditOutlined} from "@ant-design/icons";
import {useUserPermissions} from "@/entities/user/hooks/useUserPermissions";
import {getPublicPageEditor} from "@/shared/utilities/public-paths";

interface IProps {
  block?: boolean;
}

export default function EditPageButton(props: IProps) {
  const {token: {controlHeight}} = theme.useToken();
  const {userPermissions} = useUserPermissions();
  const pathname = usePathname();

  const editor = getPublicPageEditor(pathname);

  if (!editor || !userPermissions.includes(editor.permission))
    return null;

  return (
    <Link prefetch={false} style={{height: controlHeight, display: "flex"}} href={editor.href}>
      <Button icon={<EditOutlined/>} block={props.block}>
        Редагувати
      </Button>
    </Link>
  )
}
