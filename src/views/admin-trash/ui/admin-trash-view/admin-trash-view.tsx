"use client"

import {Card} from "antd";
import {TrashList} from "@/features/revision-history";
import {AdminPageHeader} from "@/shared/ui-kit";

export default function AdminTrashView() {
  return (
    <Card variant="borderless">
      <AdminPageHeader
        title="Кошик"
        description="Видалені сторінки, новини, співробітники, аспіранти й пункти меню. Їх можна відновити протягом 30 днів — разом з історією та посиланнями на них, — потім вони видаляються назавжди"
      />
      <TrashList/>
    </Card>
  )
}
