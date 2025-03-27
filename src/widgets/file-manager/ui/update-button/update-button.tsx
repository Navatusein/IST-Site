import {Button, Tooltip} from "antd";
import {Dispatch, SetStateAction} from "react";

interface IProps {
  setUpdateFiles: Dispatch<SetStateAction<number>>
}

export default function UpdateButton(props: IProps) {
  const update = () => {
    props.setUpdateFiles((prevState) => prevState + 1)
  }

  return (
    <Tooltip title="Оновити список файлів">
      <Button onClick={update}>
        Оновити
      </Button>
    </Tooltip>
  )
}
