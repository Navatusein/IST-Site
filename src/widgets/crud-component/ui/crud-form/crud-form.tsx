import {Button, Form, Flex, Space} from "antd";
import {Dispatch, ReactNode, SetStateAction, useEffect} from "react";

interface IProps<T> {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  onFormSubmit: (formData: T) => void;
  selectedRows: T[];
  children: ReactNode;
}

export default function CrudForm<T>(props: IProps<T>) {
  const [form] = Form.useForm<T>();

  useEffect(() => {
    form.resetFields();
    form.setFieldsValue(props.selectedRows[0] ?? {})
  }, [props.selectedRows]);

  return (
    <Form<T>
      form={form}
      layout="vertical"
      onFinish={props.onFormSubmit}
    >
      <Space style={{width: "100%"}} direction="vertical" size="middle">
        {props.children}
        <Form.Item style={{marginBottom: 0}}>
          <Flex style={{width: "100%"}} gap="small">
            <Button style={{width: "50%"}} onClick={() => props.setIsOpen(() => false)}>
              Відмінити
            </Button>
            <Button htmlType="submit" type="primary" style={{width: "50%"}}>
              Зберегти
            </Button>
          </Flex>
        </Form.Item>
      </Space>
    </Form>
  )
}
