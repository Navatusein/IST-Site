"use client"

import {actionSignIn} from "../../actions/actions";
import {Button, Card, Form, Input, notification, Typography} from "antd";
import {LockOutlined, UserOutlined} from "@ant-design/icons";

interface IFormData {
  login: string;
  password: string;
}

export default function SignInForm() {
  const [api, contextHolder] = notification.useNotification();

  const onFormSubmit = async (data: IFormData) => {
    await actionSignIn(data.login, data.password)
  }


  return (
    <Card style={{width: 320, margin: "0 10px"}}>
      {contextHolder}
      <Typography.Title level={3} style={{textAlign: "center"}}>
        Авторизація
      </Typography.Title>
      <Form name="sign-in" onFinish={onFormSubmit}>
        <Form.Item
          name="login"
          rules={[{required: true, message: "Enter login"}]}
        >
          <Input
            name="login"
            type="login"
            prefix={<UserOutlined/>}
            placeholder="Логін"
            autoComplete="login"
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{required: true, message: "Enter password"}]}
        >
          <Input.Password
            name="password"
            prefix={<LockOutlined/>}
            placeholder="Пароль"
            autoComplete="current-password"
          />
        </Form.Item>
        <Form.Item style={{marginBottom: 0}}>
          <Button block type="primary" htmlType="submit">
            Увійти
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
}