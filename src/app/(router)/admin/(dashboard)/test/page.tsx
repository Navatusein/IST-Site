"use client"


import {Button, Card, Col, Form, Input, Layout, Menu, Row, Statistic, Typography} from "antd";
import {BookOutlined, SolutionOutlined, TeamOutlined, UserOutlined} from "@ant-design/icons";

const { Header, Content, Footer } = Layout;
const { Title, Paragraph } = Typography;

export default function Page() {
  return (
    <Layout>
      <Header style={{ background: '#fff' }}>
        <div className="logo" style={{ float: 'left', fontWeight: 'bold', fontSize: '20px' }}>
          КАФЕДРА ІНФОРМАЦІЙНИХ СИСТЕМ
        </div>
        <Menu mode="horizontal" defaultSelectedKeys={['1']}>
          <Menu.Item key="1">Головна</Menu.Item>
          <Menu.Item key="2">Про нас</Menu.Item>
          <Menu.Item key="3">Студентам</Menu.Item>
          <Menu.Item key="4">Вступникам</Menu.Item>
          <Menu.Item key="5">Контакти</Menu.Item>
        </Menu>
      </Header>

      <Content style={{ padding: '0 50px', marginTop: 24 }}>
        <div style={{ textAlign: 'center', padding: 24, background: '#f0f2f5' }}>
          <Title>Запрошуємо до нас на навчання</Title>
          <Paragraph>
            Підготовка фахівців в області інформаційних систем та технологій за освітніми програмами бакалавра, магістра і PhD
          </Paragraph>
          <Paragraph style={{ marginTop: 24, textAlign: 'left', maxWidth: 800, marginInline: 'auto' }}>
            <b>F6 - "Інформаційні системи та технології"</b> за такими освітніми програмами:<br />
            <br />
            ОПП "Програмні технології інтернет речей",<br />
            ОПП "Технології веброзробки та вебдизайн",<br />
            <i>ОС "Бакалавр"</i>;<br />
            <br />
            ОНП "Програмні технології інтернет речей",<br />
            <i>ОС "Магістр"</i>;<br />
            <br />
            ОНП "Інформаційні системи та технології",<br />
            <i>ОС "Доктор філософії"</i>
          </Paragraph>
        </div>

        <Row gutter={16} style={{ marginTop: 24 }}>
          <Col span={6}><Statistic title="Освітні програми" value={4} prefix={<BookOutlined />} /></Col>
          <Col span={6}><Statistic title="Студенти" value={150} prefix={<TeamOutlined />} /></Col>
          <Col span={6}><Statistic title="Викладачі" value={11} prefix={<UserOutlined />} /></Col>
          <Col span={6}><Statistic title="Партнери" value={21} prefix={<SolutionOutlined />} /></Col>
        </Row>

        <Title level={2} style={{ marginTop: 48 }}>Новини та події</Title>
        <Row gutter={[16, 16]}>
          {[1, 2, 3].map(i => (
            <Col span={8} key={i}>
              <Card title={`Подія ${i}`}>
                <Paragraph>Короткий опис події. Детальніше натискайте нижче.</Paragraph>
                <Button type="primary">Детальніше</Button>
              </Card>
            </Col>
          ))}
        </Row>

        <Title level={3} style={{ marginTop: 48 }}>Зв'яжіться з нами</Title>
        <Row justify="center">
          <Col span={12}>
            <Form layout="vertical">
              <Form.Item label="Ім’я">
                <Input placeholder="Ваше ім’я" />
              </Form.Item>
              <Form.Item label="Email">
                <Input placeholder="Ваша електронна пошта" />
              </Form.Item>
              <Form.Item label="Повідомлення">
                <Input.TextArea rows={4} placeholder="Ваше повідомлення" />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">Відправити</Button>
              </Form.Item>
            </Form>
          </Col>
        </Row>
      </Content>

      <Footer style={{ textAlign: 'center' }}>
        ©2025 Кафедра інформаційних систем та технологій. Всі права захищені.
      </Footer>
    </Layout>
  );
}
