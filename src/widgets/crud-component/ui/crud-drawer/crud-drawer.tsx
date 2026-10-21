"use client"

import {ReactNode, useRef, useState} from "react";
import {App, Button, Drawer, Flex, Form, theme} from "antd";

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
  const {notification} = App.useApp();

  const [isSaving, setIsSaving] = useState<boolean>(false);
  const isSavingRef = useRef<boolean>(false);

  const save = async () => {
    if (isSavingRef.current)
      return;

    isSavingRef.current = true;
    let values: T;

    try {
      values = await form.validateFields();
    }
    catch (error) {
      const firstError = (error as {errorFields?: {errors: string[]}[]}).errorFields?.[0]?.errors[0];
      notification.error({title: "Заповніть обов'язкові поля", description: firstError});
      isSavingRef.current = false;
      return;
    }

    setIsSaving(() => true);

    try {
      await props.onSubmit(values);
    }
    finally {
      isSavingRef.current = false;
      setIsSaving(() => false);
    }
  }

  const close = () => {
    if (!isSavingRef.current)
      props.onClose();
  }

  return (
    <Drawer
      closable={!isSaving}
      mask={{closable: !isSaving}}
      keyboard={!isSaving}
      destroyOnHidden
      open={props.isOpen}
      title={props.title}
      size="large"
      onClose={close}
      footer={
        <Flex gap={padding}>
          <Button onClick={close} block disabled={isSaving}>
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
