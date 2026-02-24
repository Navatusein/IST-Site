import {DocumentViewer} from "react-documents";
import {Modal} from "antd";
import {Dispatch, SetStateAction} from "react";

interface IProps {
  filePathToPreview: string,
  setFilePathToPreview: Dispatch<SetStateAction<string>>
}

//TODO Build real path

export default function FilePreview(props: IProps) {
  return (
    <Modal
      open={props.filePathToPreview != ""}
      width="80svw"
      centered
      onCancel={() => props.setFilePathToPreview(() => "")}
      footer={null}
      title="Попередній перегляд"
    >
      <DocumentViewer
        style={{height: "80svh", width: "100%"}}
        queryParams="hl=Nl"
        url={encodeURI(`/files/${props.filePathToPreview}`)}
        viewerUrl="https://docs.google.com/gview?url=%URL%&embedded=true"
        viewer="url"
      />
    </Modal>
  )
}
