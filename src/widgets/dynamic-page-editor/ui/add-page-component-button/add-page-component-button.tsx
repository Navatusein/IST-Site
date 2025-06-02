import {Button, Flex} from "antd";
import {Dispatch, SetStateAction} from "react";

interface IProps {
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
}

export default function AddPageComponentButton(props: IProps) {
  const openModal = () => {
    props.setIsModalOpen(() => true)
  }

  return (
    <Flex style={{padding: "12px"}}>
      <Button block type="dashed" size="large" onClick={openModal}>
        Додати новий блок
      </Button>
    </Flex>
  )
}
