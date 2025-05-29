"use client"

import {Button, Drawer, Flex, Form, theme} from "antd";
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

export default function CrudDrawer<T>(props: IProps<T>) {
  const {token: {padding}} = theme.useToken();
  const [form] = Form.useForm<T>();

  const onCancel = () => {
    props.setIsOpen(false)
  }

  const onOk = () => {
    form.submit()
  }

  return (
    <Drawer
      closable
      open={props.isOpen}
      title={props.title}
      width={800}
      onClose={onCancel}
      footer={
        <Flex gap={padding}>
          <Button onClick={() => props.setIsOpen(false)} block>
            Відмінити
          </Button>
          <Button type="primary" onClick={onOk} block>
            Зберегти
          </Button>
        </Flex>
      }
    >
     <CrudForm<T>
       setIsOpen={props.setIsOpen}
       onFormSubmit={props.onFormSubmit}
       selectedRows={props.selectedRows}
       children={props.children}
       form={form}
     />
    </Drawer>
  )
}
