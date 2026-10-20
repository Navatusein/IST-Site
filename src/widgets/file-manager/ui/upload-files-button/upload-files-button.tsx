"use client"

import {Button, Tooltip, Upload} from "antd";
import {CloudUploadOutlined} from "@ant-design/icons";
import {useUploadFiles} from "../../model/use-upload-files";

export default function UploadFilesButton() {
  const {upload, isUploading} = useUploadFiles();

  return (
    <Tooltip title="Завантажити файли або перетягніть їх у список">
      <Upload
        multiple
        showUploadList={false}
        beforeUpload={(file, fileList) => {
          if (file == fileList[0])
            upload(fileList as File[]);

          return false;
        }}
      >
        <Button icon={<CloudUploadOutlined/>} loading={isUploading}>Завантажити</Button>
      </Upload>
    </Tooltip>
  )
}
