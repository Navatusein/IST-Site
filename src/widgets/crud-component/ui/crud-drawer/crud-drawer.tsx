"use client"

import {ReactNode, useState} from "react";
import {Button, Drawer, Flex, Form, theme} from "antd";

interface IProps<T extends object> {
  isOpen: boolean;
  title: string;
  initialValues: Partial<T>;
  onSubmit: (values: T) => Promise<boolean>;
  onClose: () => void;
  children: ReactNode;
}

export default function CrudDrawer<T extends object>(props: IProps<T>) {
  const {token: {padding}} = theme.useToken();
  const [form] = Form.useForm<T>();

  const [isSaving, setIsSaving] = useState<boolean>(false);

  const save = async () => {
    let values: T;

    try {
      values = await form.validateFields();
    }
    catch {
      return;
    }

    setIsSaving(() => true);

    try {
      await props.onSubmit(values);
    }
    finally {
      setIsSaving(() => false);
    }
  }

  return (
    <Drawer
      closable
      destroyOnHidden
      open={props.isOpen}
      title={props.title}
      size="large"
      onClose={props.onClose}
      footer={
        <Flex gap={padding}>
          <Button onClick={props.onClose} block disabled={isSaving}>
            Відмінити
          </Button>
          <Button type="primary" onClick={save} block loading={isSaving}>
            Зберегти
          </Button>
        </Flex>
      }
    >
      <Form<T> form={form} layout="vertical" initialValues={props.initialValues} onFinish={save}>
        <Flex vertical gap="middle">
          {props.children}
        </Flex>
      </Form>
    </Drawer>
  )
}
