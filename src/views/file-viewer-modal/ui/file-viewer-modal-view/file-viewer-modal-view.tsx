"use client"

import {Button, Result} from "antd";
import {CloseOutlined} from "@ant-design/icons";
import {useRouter} from "next/navigation";
import type {IFileEntry} from "@/entities/file";
import {FileViewer} from "@/entities/file/ui";
import {FullScreenModal} from "@/shared/ui-kit";

interface IProps {
  file: IFileEntry | null;
}

export default function FileViewerModalView(props: IProps) {
  const router = useRouter();

  const close = <Button icon={<CloseOutlined/>} onClick={() => router.back()}>Закрити</Button>;

  return (
    <FullScreenModal
      open={true}
      width={"100%"}
      onCancel={() => router.back()}
      destroyOnHidden={true}
      closable={false}
      footer={null}
    >
      {props.file ?
        <FileViewer file={props.file} barExtra={close}/> :
        <Result status="404" title="Файл не знайдено" extra={close}/>}
    </FullScreenModal>
  )
}
