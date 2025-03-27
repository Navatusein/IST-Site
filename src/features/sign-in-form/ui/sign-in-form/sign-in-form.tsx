"use client"

import {actionSignIn} from "../../actions/actions";
import {App, Button, Card, Form, Input, notification, Typography} from "antd";
import {LockOutlined, UserOutlined} from "@ant-design/icons";
import {redirect} from "next/navigation";

interface IFormData {
  login: string;
  password: string;
}

export default function SignInForm() {
  const {notification} = App.useApp();

  const onFormSubmit = async (data: IFormData) => {
    let redirectPath: string | null = null

    actionSignIn(data.login, data.password)
      .then((data) => {

        if (data?.startsWith("http")){
          redirectPath = data
          return;
        }

        switch (data) {
          case "CouldNotParseError":
          case "InvalidPasswordError":
            notification.error({message: "Помилка авторизації", description: "Неправильний логін чи пароль"});
            break
          default:
            notification.error({message: "Помилка авторизації", description: "Невідома помилка"});
            break;
        }
      })
      .catch((error) => {
        console.log(error);
        notification.error({message: "Помилка авторизації", description: "Невідома помилка"});
      })
      .finally(() => {
        if (redirectPath)
          redirect(redirectPath);
      })
  }

  return (
    <Card style={{width: 320, margin: "0 10px"}}>
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