"use client"

import {actionSignIn} from "../../actions/actions";
import {App, Button, Card, Flex, Form, Input, Typography} from "antd";
import {LockOutlined, UserOutlined} from "@ant-design/icons";
import {redirect} from "next/navigation";
import {useSession} from "next-auth/react";
import { Icon } from "@/shared/ui-kit";

interface IFormData {
  login: string;
  password: string;
}

export default function SignInForm() {
  const {notification} = App.useApp();

  const {update} = useSession();

  const onFormSubmit = async (data: IFormData) => {
    let redirectPath: string | null = null

    actionSignIn(data.login, data.password)
      .then((data) => {
        update();

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
    <Card style={{margin: "0 10px", maxWidth: 362}}>
      <Flex vertical gap="large">
        <Icon showText iconSize={64} rows={3}/>
        <Form name="sign-in" onFinish={onFormSubmit}>
          <Form.Item
            name="login"
            rules={[{required: true, message: "Введіть логін"}]}
          >
            <Input
              name="login"
              type="login"
              prefix={<UserOutlined/>}
              placeholder="Логін"
              autoComplete="login username email"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{required: true, message: "Введіть пароль"}]}
          >
            <Input.Password
              name="password"
              prefix={<LockOutlined/>}
              placeholder="Пароль"
              autoComplete="password"
            />
          </Form.Item>
          <Form.Item style={{marginBottom: 0}}>
            <Button block type="primary" htmlType="submit">
              Увійти
            </Button>
          </Form.Item>
        </Form>
      </Flex>
    </Card>
  );
}