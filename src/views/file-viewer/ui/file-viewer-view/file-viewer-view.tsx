import {FileViewer} from "@/entities/file/ui";
import {Flex} from "antd";

interface IProps {
  path: string;
}

export default function FileViewerView(props: IProps) {
  return (
    <Flex vertical style={{height: "calc(100svh - 60px)"}}>
      <FileViewer file={props.path} style={{height: "100%"}}/>
    </Flex>
  )
}
