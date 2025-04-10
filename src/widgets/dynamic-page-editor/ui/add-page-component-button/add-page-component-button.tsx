import {Button} from "antd";
import {Dispatch, SetStateAction} from "react";

interface IProps {
  editMode: boolean;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
}

export default function AddPageComponentButton(props: IProps) {
  const openModal = () => {
    props.setIsModalOpen(() => true)
  }

  return (
    <>
      {props.editMode &&
        <Button block type="dashed" size="large" onClick={openModal}>
          Додати новий блок
        </Button>
      }
    </>
  )
}
