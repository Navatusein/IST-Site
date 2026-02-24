"use client"

import {App, Button, Tooltip, Upload} from "antd";
import {uploadFilesAction} from "@/shared/services/file-manager-service/actions/actions";
import type {UploadRequestOption} from "@rc-component/upload/lib/interface";
import {Dispatch, SetStateAction} from "react";
import {CloudUploadOutlined} from "@ant-design/icons";
import {useServerAction} from "@/shared/hooks/use-server-action";

interface IProps {
  currentPath: string;
  setUpdateFiles: Dispatch<SetStateAction<number>>
}

export default function UploadFilesButton(props: IProps) {
  const {notification} = App.useApp();

  const uploadFile = (options: UploadRequestOption<any>) => {
    const file = options.file as File;

    useServerAction(uploadFilesAction(props.currentPath, file))
      .then(() => {
        notification.success({title: "Файл завантажено успішно", description: file.name});
        setTimeout(() => {
          props.setUpdateFiles((prevState) => prevState + 1);
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