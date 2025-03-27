"use client"

import {App, Button, Tooltip, Upload} from "antd";
import {uploadFilesAction} from "@/shared/services/file-manager-service/actions/actions";
import type {UploadRequestOption} from "rc-upload/lib/interface";
import {Dispatch, SetStateAction} from "react";

interface IProps {
  currentPath: string;
  setUpdateFiles: Dispatch<SetStateAction<number>>
}

export default function UploadFilesButton(props: IProps) {
  const {notification} = App.useApp();

  const uploadFile = (options: UploadRequestOption<any>) => {
    const file = options.file as File;

    uploadFilesAction(props.currentPath, file)
      .then(() => {
        notification.success({message: "Файл завантажено успішно", description: file.name});
        setTimeout(() => {
          props.setUpdateFiles((prevState) => prevState + 1);
        }, 500)
      })
      .catch((error) => {
        notification.error({message: "Помилка завантаження файлу", description: error.message});
      });
  }

  return (
    <Tooltip title="Завантажити файли">
      <Upload multiple customRequest={uploadFile} showUploadList={false}>
        <Button>Завантажити</Button>
      </Upload>
    </Tooltip>
  )
}