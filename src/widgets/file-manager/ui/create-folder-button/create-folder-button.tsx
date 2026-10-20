"use client"

import {Button, Tooltip} from "antd";
import {useContext} from "react";
import {FolderAddOutlined} from "@ant-design/icons";
import {EntryNameModalContext} from "../../model/entry-name-modal-context";

export default function CreateFolderButton() {
  const {openCreateFolder} = useContext(EntryNameModalContext);

  return (
    <Tooltip title="Створити нову папку">
      <Button icon={<FolderAddOutlined/>} onClick={openCreateFolder}>
        Створити папку
      </Button>
    </Tooltip>
  )
}
