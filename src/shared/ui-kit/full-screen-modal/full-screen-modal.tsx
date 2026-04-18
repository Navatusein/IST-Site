import {Modal} from "antd";
import type {ModalProps} from "antd/es/modal/interface";
import styles from "./full-screen-modal.module.scss";


interface IProps {
}

export default function FullScreenModal(props: IProps & ModalProps) {
  const {className, classNames, ...modalProps} = props;

  return (
    <Modal
      {...modalProps}
      className={styles.modal}
      classNames={{
        body: styles.body,
      }}
    />
  )
}
