import {Button, Flex, Form, Input, Modal} from "antd";
import {Dispatch, SetStateAction} from "react";
import {LockOutlined} from "@ant-design/icons";

interface IProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  username: string;
  setPassword: (value: string) => void;
}

interface IFormData {
  username: string;
  password: string;
  repeatPassword: string;
}

export default function PasswordModal(props: IProps) {
  const [form] = Form.useForm();

  const checkConfirmPassword = (value: string) => {
    return new Promise((resolve, reject) => {
      if (!value || form.getFieldValue("password") !== value)
        reject("Паролі не співпадають!");

      resolve("");
    });
  }

  const onFinish = (formData: IFormData) => {
    props.setPassword(formData.password)
  }

  return (
    <Modal
      closable
      open={props.isOpen}
      title="Зміна пароля користувача"
      onCancel={() => {props.setIsOpen(false)}}
      footer={null}
    >
      <Form<IFormData>
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{"username": props.username}}
      >
        <Flex vertical gap="middle">
          <Form.Item<IFormData> hidden name="username">
            <Input autoComplete="username"/>
          </Form.Item>
          <Form.Item<IFormData>
            label="Новий пароль"
            name="password"
            extra="Новий пароль користувача"
            style={{marginBottom: 0}}
            rules={[
              {
                required: true, message: "Введіть новий пароль!"
              }
            ]}
          >
            <Input.Password
              name="password"
              prefix={<LockOutlined/>}
              placeholder="Пароль"
              autoComplete="new-password"
            />
          </Form.Item>
          <Form.Item<IFormData>
            label="Підтвердіть пароль"
            name="repeatPassword"
            extra="Підтвердіть новий пароль користувача"
            style={{marginBottom: 0}}
            dependencies={["password"]}
            rules={[
              {
                required: true,
                message: "Введіть повторно новий пароль"
              },
              {
                validator: (_, value) => checkConfirmPassword(value),
              }
            ]}
          >
            <Input.Password
              name="repeatPassword"
              prefix={<LockOutlined/>}
              placeholder="Повторіть пароль"
              autoComplete="new-password"
            />
          </Form.Item>
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
        </Flex>
      </Form>
    </Modal>
  )
}
