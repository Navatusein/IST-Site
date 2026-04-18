import {Button, Tooltip} from "antd";
import {useContext} from "react";
import {ReloadOutlined} from "@ant-design/icons";
import {FileExplorerContext} from "@/shared/context/file-explorer-context/file-explorer-context";

interface IProps {}

export default function UpdateButton(props: IProps) {
  const {setUpdateFiles} = useContext(FileExplorerContext);

  const update = () => {
    setUpdateFiles((prevState) => prevState + 1)
  }

  return (
    <Tooltip title="Оновити список файлів">
      <Button icon={<ReloadOutlined/>} onClick={update}>
        Оновити
      </Button>
    </Tooltip>
  )
}
