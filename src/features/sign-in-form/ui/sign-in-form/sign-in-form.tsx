"use client"

import {actionSignIn} from "../../actions/actions";
import {App, Button, Card, Flex, Form, Input} from "antd";
import {LockOutlined, UserOutlined} from "@ant-design/icons";
import {useRouter} from "next/navigation";
import {useState} from "react";
import {Icon} from "@/shared/ui-kit";
import {unwrapServerAction} from "@/shared/utilities/unwrap-server-action";

interface IFormData {
  login: string;
  password: string;
}

export default function SignInForm() {
  const {notification} = App.useApp();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onFormSubmit = (data: IFormData) => {
    setIsLoading(() => true);

    unwrapServerAction(actionSignIn(data.login, data.password))
      .then((result) => {
        switch (result) {
          case "Success":
            router.push("/admin");
            router.refresh();
            return;
          case "TooManyAttempts":
            notification.error({title: "Помилка авторизації", description: "Забагато спроб входу, спробуйте пізніше"});
            break;
          default:
            notification.error({title: "Помилка авторизації", description: "Неправильний логін чи пароль"});
            break;
        }

        setIsLoading(() => false);
      })
      .catch((error) => {
        console.log(error);
        notification.error({title: "Помилка авторизації", description: "Невідома помилка"});
        setIsLoading(() => false);
      });
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
            <Button block type="primary" htmlType="submit" loading={isLoading}>
              Увійти
            </Button>
          </Form.Item>
        </Form>
      </Flex>
    </Card>
  );
}
