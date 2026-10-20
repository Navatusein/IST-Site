"use client"

import {App, Button, Tooltip, Upload} from "antd";
import type {UploadRequestOption} from "@rc-component/upload/lib/interface";
import {useContext} from "react";
import {CloudUploadOutlined} from "@ant-design/icons";
import type {IFileEntry} from "@/entities/file";
import {postForm} from "@/shared/utilities/post-form";
import {FILES_UPLOAD_URL} from "@/shared/utilities/file-urls";
import {FileExplorerContext} from "@/entities/file/ui";
import {unwrapServerAction} from "@/shared/utilities/unwrap-server-action";

export default function UploadFilesButton() {
  const {notification} = App.useApp();
  const {currentFolder, setUpdateFiles} = useContext(FileExplorerContext);

  const uploadFile = (options: UploadRequestOption<any>) => {
    const file = options.file as File;
    const form = new FormData();
    form.append("file", file);

    if (currentFolder)
      form.append("folder", currentFolder);

    unwrapServerAction(postForm<IFileEntry>(FILES_UPLOAD_URL, form))
      .then(() => {
        notification.success({title: "Файл завантажено успішно", description: file.name});
        setUpdateFiles((prevState) => prevState + 1);
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
