import {Button, Tooltip} from "antd";
import {useContext} from "react";
import {ReloadOutlined} from "@ant-design/icons";
import {FileExplorerContext} from "@/entities/file/ui";

export default function UpdateButton() {
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
