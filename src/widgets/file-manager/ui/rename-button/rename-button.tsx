import {Button, Tooltip} from "antd";
import {useContext} from "react";
import {FormOutlined} from "@ant-design/icons";
import {FileExplorerContext} from "@/entities/file/ui";
import {useFileActions} from "../../model/use-file-actions";

export default function RenameButton() {
  const {selectedEntries} = useContext(FileExplorerContext);
  const {rename} = useFileActions();

  return (
    <Tooltip title="Перейменувати вибраний файл">
      <Button icon={<FormOutlined/>} onClick={() => rename(selectedEntries[0])} disabled={selectedEntries.length != 1}>
        Перейменувати
      </Button>
    </Tooltip>
  )
}
