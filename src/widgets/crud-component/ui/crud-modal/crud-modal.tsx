"use client"

import {Modal} from "antd";
import {Dispatch, ReactNode, SetStateAction} from "react";
import CrudForm from "../crud-form/crud-form";

interface IProps<T> {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  onFormSubmit: (formData: T) => void;
  title: string;
  selectedRows: T[];
  children: ReactNode;
}

export default function CrudModal<T>(props: IProps<T>) {
  return (
    <Modal
      closable
      open={props.isOpen}
      title={props.title}
      onCancel={() => {props.setIsOpen(false)}}
      footer={null}
    >
     <CrudForm<T>
       setIsOpen={props.setIsOpen}
       onFormSubmit={props.onFormSubmit}
       selectedRows={props.selectedRows}
       children={props.children}
     />
    </Modal>
  )
}
