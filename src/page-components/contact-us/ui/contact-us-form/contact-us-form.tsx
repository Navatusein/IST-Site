import {useState} from "react";
import {App, Button, Col, Flex, Form, Input, Row, theme} from "antd";
import {unwrapServerAction} from "@/shared/utilities/unwrap-server-action";
import {sendContactUsMessageAction} from "../../actions/actions";
import {CONTACT_US_LIMITS, IContactUsMessage} from "../../types/type";

export default function ContactUsForm() {
  const {token: {paddingXS}} = theme.useToken();
  const {notification} = App.useApp();
  const [form] = Form.useForm<IContactUsMessage>();

  const [isSending, setIsSending] = useState<boolean>(false);

  const send = (data: IContactUsMessage) => {
    setIsSending(() => true);

    unwrapServerAction(sendContactUsMessageAction(data))
      .then(() => {
        notification.success({title: "Ваше повідомлення успішно відправлено", description: "Ми відповімо на вказану пошту"});
        form.resetFields();
      })
      .catch((error) => {
        notification.error({title: "Помилка відправлення повідомлення", description: error.message});
      })
      .finally(() => setIsSending(() => false));
  }

  return (
    <Form<IContactUsMessage> form={form} layout="vertical" onFinish={send} disabled={isSending}>
      <Row gutter={[paddingXS, paddingXS]}>
        <Col xs={24} sm={12}>
          <Form.Item<IContactUsMessage>
            name="name"
            style={{margin: 0}}
            rules={[{required: true, whitespace: true, message: "Вкажіть ваше ім'я"}]}
          >
            <Input placeholder="Ваше ім'я" autoComplete="name" maxLength={CONTACT_US_LIMITS.name}/>
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item<IContactUsMessage>
            name="email"
            style={{margin: 0}}
            rules={[
              {required: true, message: "Вкажіть пошту для відповіді"},
              {type: "email", message: "Некоректна адреса пошти"}
            ]}
          >
            <Input type="email" placeholder="Ваш Email" autoComplete="email" maxLength={CONTACT_US_LIMITS.email}/>
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item<IContactUsMessage> name="subject" style={{margin: 0}}>
            <Input placeholder="Тема" maxLength={CONTACT_US_LIMITS.subject}/>
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item<IContactUsMessage>
            name="message"
            style={{margin: 0}}
            rules={[
              {required: true, whitespace: true, message: "Напишіть повідомлення"},
              {min: CONTACT_US_LIMITS.messageMin, message: `Щонайменше ${CONTACT_US_LIMITS.messageMin} символів`}
            ]}
          >
            <Input.TextArea placeholder="Повідомлення" style={{minHeight: 150}} maxLength={CONTACT_US_LIMITS.message}/>
          </Form.Item>
        </Col>
        <Form.Item<IContactUsMessage> name="website" hidden>
          <Input tabIndex={-1} autoComplete="off" aria-hidden/>
        </Form.Item>
        <Col span={24}>
          <Flex justify="center">
            <Button type="primary" htmlType="submit" loading={isSending} disabled={false}>
              Відправити
            </Button>
          </Flex>
        </Col>
      </Row>
    </Form>
  )
}
