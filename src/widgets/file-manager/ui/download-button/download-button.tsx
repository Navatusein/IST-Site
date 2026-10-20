import {Button, Tooltip} from "antd";
import {useContext} from "react";
import {CloudDownloadOutlined} from "@ant-design/icons";
import {FileExplorerContext} from "@/entities/file/ui";
import {getFileDownloadUrl, getFilesArchiveUrl} from "@/shared/utilities/file-urls";

const startDownload = (url: string) => {
  const link = document.createElement("a");
  link.href = url;
  link.download = "";
  link.click();
}

export default function DownloadButton() {
  const {selectedEntries, setSelectedEntries} = useContext(FileExplorerContext);

  const isSingleFile = selectedEntries.length == 1 && selectedEntries[0].kind == "file";

  const download = () => {
    startDownload(isSingleFile ?
      getFileDownloadUrl(selectedEntries[0].slug) :
      getFilesArchiveUrl(selectedEntries.map((entry) => entry.slug)));

    setSelectedEntries(() => []);
  }

  return (
    <Tooltip title={isSingleFile || selectedEntries.length == 0 ? "Скачати вибраний файл" : "Скачати вибране одним ZIP-архівом"}>
      <Button icon={<CloudDownloadOutlined/>} onClick={download} disabled={selectedEntries.length == 0}>
        Скачати
      </Button>
    </Tooltip>
  )
}
