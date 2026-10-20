import {Button} from "antd";
import {CloseOutlined} from "@ant-design/icons";
import type {IFileEntry} from "@/entities/file";
import {FileViewer} from "@/entities/file/ui";
import {FullScreenModal} from "@/shared/ui-kit";

interface IProps {
  file: IFileEntry | null;
  onClose: () => void;
}

export default function FilePreviewModal(props: IProps) {
  return (
    <FullScreenModal
      open={props.file != null}
      width={"100%"}
      onCancel={props.onClose}
      destroyOnHidden
      closable={false}
      footer={null}
    >
      {props.file && (
        <FileViewer
          file={props.file}
          barExtra={<Button icon={<CloseOutlined/>} onClick={props.onClose}>Закрити</Button>}
        />
      )}
    </FullScreenModal>
  )
}
