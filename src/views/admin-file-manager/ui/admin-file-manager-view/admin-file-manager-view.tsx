"use client"

import {FileManager} from "@/widgets/file-manager";
import {Card} from "antd";
import fillHeight from "@/shared/styles/fill-height.module.scss";
import {AdminPageHeader} from "@/shared/ui-kit";

export default function AdminFileManagerView() {
  return (
    <Card variant="borderless" className={fillHeight.page}>
      <AdminPageHeader
        title="Файловий менеджер"
        description="Зображення й документи сайту. Папки лише впорядковують файли: перейменування й переміщення не ламає посилань на них. Файли можна перетягнути в список, щоб завантажити"
      />
      <FileManager/>
    </Card>
  )
}
