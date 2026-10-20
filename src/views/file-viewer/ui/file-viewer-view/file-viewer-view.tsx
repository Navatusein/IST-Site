import type {IFileEntry} from "@/entities/file";
import {FileViewer} from "@/entities/file/ui";
import {Flex} from "antd";

interface IProps {
  file: IFileEntry | null;
}

export default function FileViewerView(props: IProps) {
  return (
    <Flex vertical style={{height: "calc(100svh - 60px)", padding: 16}}>
      <FileViewer file={props.file}/>
    </Flex>
  )
}
