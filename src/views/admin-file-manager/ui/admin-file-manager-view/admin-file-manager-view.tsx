"use client"

import {FileManager} from "@/widgets/file-manager";
import {Card} from "antd";
import {AdminPageHeader} from "@/shared/ui-kit";

export default function AdminFileManagerView() {
  return (
    <Card variant="borderless">
      <AdminPageHeader
        title="Файловий менеджер"
        description="Зображення й документи сайту. Папки лише впорядковують файли: перейменування й переміщення не ламає посилань на них. Файли можна перетягнути в список, щоб завантажити"
      />
      <FileManager/>
    </Card>
  )
}
