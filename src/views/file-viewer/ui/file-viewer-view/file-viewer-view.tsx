import {FileViewer} from "@/features/file-viewer";
import {Flex} from "antd";

interface IProps {
  path: string;
}

export default function FileViewerView(props: IProps) {
  return (
    <Flex vertical style={{height: "calc(100svh - 60px)"}}>
      <FileViewer filePath={props.path} style={{height: "100%"}}/>
    </Flex>
  )
}
