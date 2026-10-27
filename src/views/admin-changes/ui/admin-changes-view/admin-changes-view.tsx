"use client"

import {Card} from "antd";
import fillHeight from "@/shared/styles/fill-height.module.scss";
import {RevisionLog} from "@/features/revision-history";
import {AdminPageHeader} from "@/shared/ui-kit";

export default function AdminChangesView() {
  return (
    <Card variant="borderless" className={fillHeight.page}>
      <AdminPageHeader
        title="Журнал змін"
        description="Усі збереження сторінок, новин, співробітників, аспірантів і меню: хто, коли і що змінив. Натисніть на рядок, щоб порівняти з попередньою версією; відновити версію можна в історії запису"
      />
      <RevisionLog/>
    </Card>
  )
}
