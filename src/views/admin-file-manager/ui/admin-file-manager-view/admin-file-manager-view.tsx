"use client"

import {FileManager} from "@/widgets/file-manager";
import {Card, Typography} from "antd";

export default function AdminFileManagerView() {
  return (
    <Card variant="borderless">
      <Typography.Title level={2}>Файловий менеджер</Typography.Title>
      <FileManager/>
    </Card>
  )
}
