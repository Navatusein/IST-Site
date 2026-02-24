import {useMemo} from "react";
import {IBasePageComponent} from "@/entities/dynamic-page";
import {PageComponentError} from "@/shared/ui-kit";
import ContactUsEditor from "../contact-us-editor/contact-us-editor";
import {IContactUsPageComponent} from "../../types/type";
import {App, Button, Card, Col, Flex, Form, Input, Row, theme, Typography} from "antd";
import {EnvironmentOutlined, MailOutlined, PhoneOutlined} from "@ant-design/icons";
import {sendEmailAction} from "@/shared/services/email-service/actions/actions";
import {useServerAction} from "@/shared/hooks/use-server-action";

interface IProps {
  componentProps: IBasePageComponent;
}

interface IFormData {
  name: string;
  email: string;
  subject: string;
  content: string;
}

export default function ContactUs(props: IProps) {
  const {token: {padding, paddingXS}} = theme.useToken();
  const {notification} = App.useApp();

  const typedComponentProps = useMemo(() => {
    if (props.componentProps.type !== "contact-us")
      return null;

    return props.componentProps as IContactUsPageComponent;
  }, [props]);

  const formSubmit = (formData: IFormData) => {
    const subject = `IST ${formData.subject} від: ${formData.name}`;
    const content = `
    Імя: ${formData.name}
    Пошта: ${formData.email}
    Тема: ${formData.subject}\n
    ${formData.content}
    `;

    useServerAction(sendEmailAction(undefined, subject, content))
      .then(() => {
        notification.success({
          message: "Ваше повідомленя успішно відправлено"
        });
      })
      .catch(() => {
        notification.error({
          message: "Помилка відправленя повідомлення"
        });
      })
  }

  return (
    <PageComponentError message={typedComponentProps == null ? "Fail" : ""}>
      <Row gutter={[padding, padding]}>
        <Col sm={{span: 24}} md={{span: 12}}>
          <Row gutter={[padding, padding]}>
            <Col span={24}>
              <Card variant="borderless">
                <Flex vertical align="center" gap="small">
                  <EnvironmentOutlined style={{fontSize: 32}}/>
                  <Typography.Title level={4} style={{margin: 0}}>
                    Наша адреса
                  </Typography.Title>
                  <Typography.Link style={{textAlign: "center"}} href={"https://maps.app.goo.gl/wEdHhfHdVc15HExb9"}>
                    вул. Богдана Гаврилишина, 24, Київ
                  </Typography.Link>
                </Flex>
              </Card>
            </Col>
            <Col span={12}>
              <Card variant="borderless">
                <Flex vertical align="center" gap="small">
                  <MailOutlined style={{fontSize: 32}}/>
                  <Typography.Title level={4} style={{margin: 0}}>
                    Email
                  </Typography.Title>
                  <Typography.Link style={{textAlign: "center"}} href={"mailto:ist@fit.knu.ua"}>
                    ist@fit.knu.ua
                  </Typography.Link>
                </Flex>
              </Card>
            </Col>
            <Col span={12}>
              <Card variant="borderless">
                <Flex vertical align="center" gap="small">
                  <PhoneOutlined style={{fontSize: 32}}/>
                  <Typography.Title level={4} style={{margin: 0}}>
                    Телефон
                  </Typography.Title>
                  <Typography.Link style={{textAlign: "center"}} href={"tel:+380445213356"}>
                    044 521 33 56
                  </Typography.Link>
                </Flex>
              </Card>
            </Col>
          </Row>
        </Col>
        <Col sm={{span: 24}} md={{span: 12}}>
          <Card variant="borderless" style={{height: "100%"}} styles={{body: {height: "100%"}}}>
            <Form layout="vertical" style={{height: "100%"}} onFinish={formSubmit}>
              <Row gutter={[paddingXS, paddingXS]}>
                <Col xs={{span: 24}} sm={{span: 12}}>
                  <Form.Item<IFormData>
                    name="name"
                    style={{margin: 0}}
                    rules={[{required: true, message: ""}]}
                  >
                    <Input placeholder="Ваше ім'я"/>
                  </Form.Item>
                </Col>
                <Col xs={{span: 24}} sm={{span: 12}}>
                  <Form.Item<IFormData>
                    name="email"
                    style={{margin: 0}}
                    rules={[{required: true, message: ""}]}
                  >
                    <Input placeholder="Ваш Email"/>
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item<IFormData>
                    name="subject"
                    style={{margin: 0}}
                  >
                    <Input placeholder="Тема"/>
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item<IFormData>
                    name="content"
                    style={{margin: 0}}
                    rules={[{required: true, message: ""}]}
                  >
                    <Input.TextArea placeholder="Повідомлення" style={{minHeight: 150}}/>
                  </Form.Item>
                </Col>
                <Col span={24} style={{justifyItems: "center"}}>
                  <Form.Item style={{margin: 0}}>
                    <Button type="primary" htmlType="submit">
                      Відправити
                    </Button>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Card>
        </Col>
      </Row>
    </PageComponentError>
  )
}

ContactUs.Editor = ContactUsEditor