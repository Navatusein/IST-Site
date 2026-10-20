"use client"

import {CSSProperties, ReactNode, useContext, useEffect} from "react";
import {Form, FormInstance} from "antd";
import {EditorFormHostContext} from "./editor-form-host";

interface IProps<T extends object> {
  value: T;
  onChange: (value: T) => void;
  form?: FormInstance;
  style?: CSSProperties;
  children: ReactNode;
}

export default function EditorForm<T extends object>(props: IProps<T>) {
  const [ownForm] = Form.useForm();
  const form = props.form ?? ownForm;

  const host = useContext(EditorFormHostContext);

  useEffect(() => {
    host?.register(form);
    return () => host?.register(null);
  }, [host?.register, form]);

  const onChange = () => {
    props.onChange(form.getFieldsValue(true));
  }

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={props.value as never}
      style={{width: "100%", ...props.style}}
      onFieldsChange={onChange}
    >
      {props.children}
    </Form>
  )
}
