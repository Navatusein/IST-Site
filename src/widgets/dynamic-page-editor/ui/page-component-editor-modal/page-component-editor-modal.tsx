import {Modal} from "antd";
import {PageComponentRenderer} from "@/widgets/page-component-renderer";
import {Dispatch, SetStateAction, useEffect, useState} from "react";
import {IBasePageComponent} from "@/entities/dynamic-page";

interface IProps {
  isModalOpen: boolean;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
  component: IBasePageComponent;
  updateComponent: (value: IBasePageComponent) => void;
}

export default function PageComponentEditorModal(props: IProps) {
  const [localComponentState, setLocalComponentState] = useState<IBasePageComponent>(props.component)

  useEffect(() => {
    setLocalComponentState(() => props.component);
  }, [props.component]);

  const onOk = () => {
    props.updateComponent(localComponentState);
    props.setIsModalOpen(() => false);
  }

  const onCancel = () => {
    setLocalComponentState(() => props.component);
    props.setIsModalOpen(() => false);
  }

  return (
    <Modal
      title="Редагувати компонент"
      open={props.isModalOpen}
      onCancel={onCancel}
      width={800}
      onOk={onOk}
      okText="Зберегти"
      cancelText="Відмінити"
      destroyOnClose
    >
      <PageComponentRenderer
        propsClass={localComponentState}
        editMode
        onChange={setLocalComponentState}
      />
    </Modal>
  )
}
