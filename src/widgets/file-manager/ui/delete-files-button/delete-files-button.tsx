"use client"

import {Button, Tooltip} from "antd";
import {useContext} from "react";
import {DeleteOutlined} from "@ant-design/icons";
import {FileExplorerContext} from "@/entities/file/ui";
import {useFileActions} from "../../model/use-file-actions";

export default function DeleteFilesButton() {
  const {selectedEntries} = useContext(FileExplorerContext);
  const {remove} = useFileActions();

  return (
    <Tooltip title="Видалити вибрані файли">
      <Button icon={<DeleteOutlined/>} danger onClick={() => remove(selectedEntries)} disabled={selectedEntries.length == 0}>
        Видалити
      </Button>
    </Tooltip>
  )
}
