"use client"

import {Button, Tooltip, Upload} from "antd";
import {CloudUploadOutlined} from "@ant-design/icons";
import {useUploads} from "../../context/uploads-context";

export default function UploadFilesButton() {
  const {upload, isUploading} = useUploads();

  return (
    <Tooltip title="Завантажити файли в поточну папку; їх можна й перетягнути у список">
      <Upload
        multiple
        showUploadList={false}
        beforeUpload={(file, fileList) => {
          if (file == fileList[0])
            upload(fileList as File[]);

          return false;
        }}
      >
        <Button type="primary" icon={<CloudUploadOutlined/>} loading={isUploading}>Завантажити</Button>
      </Upload>
    </Tooltip>
  )
}
