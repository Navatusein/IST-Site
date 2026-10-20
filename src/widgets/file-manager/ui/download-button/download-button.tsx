import {Button, Tooltip} from "antd";
import {useContext} from "react";
import {CloudDownloadOutlined} from "@ant-design/icons";
import {FileExplorerContext} from "@/entities/file/ui";
import {useFileActions} from "../../model/use-file-actions";

export default function DownloadButton() {
  const {selectedEntries, setSelectedEntries} = useContext(FileExplorerContext);
  const {download} = useFileActions();

  const isSingleFile = selectedEntries.length == 1 && selectedEntries[0].kind == "file";

  return (
    <Tooltip title={isSingleFile || selectedEntries.length == 0 ? "Скачати вибраний файл" : "Скачати вибране одним ZIP-архівом"}>
      <Button
        icon={<CloudDownloadOutlined/>}
        onClick={() => {
          download(selectedEntries);
          setSelectedEntries(() => []);
        }}
        disabled={selectedEntries.length == 0}
      >
        Скачати
      </Button>
    </Tooltip>
  )
}
