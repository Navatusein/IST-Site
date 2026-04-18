import {Button, Tooltip} from "antd";
import {useContext} from "react";
import {isDirectoryAction} from "@/shared/services/file-manager-service/actions/actions";
import {CloudDownloadOutlined} from "@ant-design/icons";
import normalizeUrl from "normalize-url";
import {useServerAction} from "@/shared/hooks/use-server-action";
import {FileExplorerContext} from "@/shared/context/file-explorer-context/file-explorer-context";

interface IProps {}

export default function DownloadButton(props: IProps) {
  const {selectedRowKeys, setSelectedRowKeys} = useContext(FileExplorerContext);

  const download = async () => {
    for (const key of selectedRowKeys) {
      const path = key as string;

      if (await useServerAction(isDirectoryAction(path)))
        continue;

      const link = document.createElement("a");

      link.download = "";
      link.href = normalizeUrl(`${window.location.origin}/api/assets/${path}`);
      link.click();
    }

    setSelectedRowKeys(() => []);
  }

  return (
    <Tooltip title="Скачати вибрані файли">
      <Button icon={<CloudDownloadOutlined/>} onClick={download} disabled={selectedRowKeys.length == 0}>
        Скачати
      </Button>
    </Tooltip>
  )
}
