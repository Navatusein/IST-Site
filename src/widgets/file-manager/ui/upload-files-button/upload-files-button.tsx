"use client"

import {App, Button, Tooltip, Upload} from "antd";
import {uploadFilesAction} from "@/shared/services/file-manager-service/actions/actions";
import type {UploadRequestOption} from "@rc-component/upload/lib/interface";
import {useContext} from "react";
import {CloudUploadOutlined} from "@ant-design/icons";
import {useServerAction} from "@/shared/hooks/use-server-action";
import {FileExplorerContext} from "@/shared/context/file-explorer-context/file-explorer-context";

interface IProps {}

export default function UploadFilesButton(props: IProps) {
  const {notification} = App.useApp();
  const {currentPath, setUpdateFiles} = useContext(FileExplorerContext);

  const uploadFile = (options: UploadRequestOption<any>) => {
    const file = options.file as File;

    useServerAction(uploadFilesAction(currentPath, file))
      .then(() => {
        notification.success({title: "Файл завантажено успішно", description: file.name});
        setTimeout(() => {
          setUpdateFiles((prevState) => prevState + 1);
        }, 500)
      })
      .catch((error) => {
        notification.error({title: "Помилка завантаження файлу", description: error.message});
      });
  }

  return (
    <Tooltip title="Завантажити файли">
      <Upload multiple customRequest={uploadFile} showUploadList={false}>
        <Button icon={<CloudUploadOutlined/>}>Завантажити</Button>
      </Upload>
    </Tooltip>
  )
}