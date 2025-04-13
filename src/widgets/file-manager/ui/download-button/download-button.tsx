import {Button, Tooltip} from "antd";
import {Dispatch, Key, SetStateAction} from "react";
import {isDirectoryAction} from "@/shared/services/file-manager-service/actions/actions";
import {CloudDownloadOutlined, DownloadOutlined} from "@ant-design/icons";

interface IProps {
  selectedRowKeys: Key[],
  setSelectedRowKeys: Dispatch<SetStateAction<Key[]>>
}

export default function DownloadButton(props: IProps) {
  const download = () => {
    props.selectedRowKeys.forEach(async (key) => {
      const path = key as string;

      if (await isDirectoryAction(path))
        return;

      const link = document.createElement("a");

      link.download = "";
      link.href = `http://localhost:3000/files/${path}`;
      link.click();
    });

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
