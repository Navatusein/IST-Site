import {Button, Tooltip} from "antd";
import {Dispatch, Key, SetStateAction} from "react";
import {isDirectoryAction} from "@/shared/services/file-manager-service/actions/actions";
import {CloudDownloadOutlined} from "@ant-design/icons";
import normalizeUrl from "normalize-url";
import {useServerAction} from "@/shared/hooks/use-server-action";

interface IProps {
  selectedRowKeys: Key[],
  setSelectedRowKeys: Dispatch<SetStateAction<Key[]>>
}

export default function DownloadButton(props: IProps) {
  const download = async () => {
    for (const key of props.selectedRowKeys) {
      const path = key as string;

      if (await useServerAction(isDirectoryAction(path)))
        continue;

      const link = document.createElement("a");

      link.download = "";
      link.href = normalizeUrl(`${window.location.origin}/api/assets/${path}`);
      link.click();
    }

    props.setSelectedRowKeys(() => []);
  }

  return (
    <Tooltip title="Скачати вибрані файли">
      <Button icon={<CloudDownloadOutlined/>} onClick={download} disabled={props.selectedRowKeys.length == 0}>
        Скачати
      </Button>
    </Tooltip>
  )
}
