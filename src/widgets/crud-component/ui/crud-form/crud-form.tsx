import {Form, Flex, FormInstance} from "antd";
import {Dispatch, ReactNode, SetStateAction, useEffect} from "react";

interface IProps<T> {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  onFormSubmit: (formData: T) => void;
  selectedRows: T[];
  children: ReactNode;
  form: FormInstance<T>;
}

export default function CrudForm<T>(props: IProps<T>) {
  useEffect(() => {
    props.form.resetFields();
    props.form.setFieldsValue(props.selectedRows[0] ?? {})
  }, [props.selectedRows]);

  return (
    <Form<T> form={props.form} layout="vertical" onFinish={props.onFormSubmit}>
      <Flex vertical gap="middle">
        {props.children}
      </Flex>
    </Form>
  )
}
