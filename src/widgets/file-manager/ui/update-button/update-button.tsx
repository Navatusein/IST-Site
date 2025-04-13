import {Button, Tooltip} from "antd";
import {Dispatch, SetStateAction} from "react";
import {ReloadOutlined} from "@ant-design/icons";

interface IProps {
  setUpdateFiles: Dispatch<SetStateAction<number>>
}

export default function UpdateButton(props: IProps) {
  const update = () => {
    props.setUpdateFiles((prevState) => prevState + 1)
  }

  return (
    <Tooltip title="Оновити список файлів">
      <Button icon={<ReloadOutlined/>} onClick={update}>
        Оновити
      </Button>
    </Tooltip>
  )
}
