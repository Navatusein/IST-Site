"use client"

import {ReactNode, useState} from "react";
import {useRouter} from "next/navigation";
import {App, Button, Card, Col, Flex, Form, Input, Row, Select, theme, Typography} from "antd";
import {ISiteSettingsData, ISocialLink} from "@/entities/site-settings";
import {MAP_EMBED_URL_PREFIX, SOCIAL_NETWORK_NAMES} from "@/entities/site-settings/types/type";
import {updateSiteSettingsAction} from "@/entities/site-settings/actions/actions";
import {SocialNetworkIcon} from "@/entities/site-settings/ui";
import {unwrapServerAction} from "@/shared/utilities/unwrap-server-action";
import {FormSortableList} from "@/shared/ui-kit";

interface IProps {
  settings: ISiteSettingsData;
}

const SOCIAL_NETWORK_OPTIONS = Object.entries(SOCIAL_NETWORK_NAMES).map(([value, label]) => ({
  value,
  label: (
    <Flex gap="small">
      <SocialNetworkIcon network={value as ISocialLink["network"]}/>
      {label}
    </Flex>
  )
}));

const itemStyle = {marginBottom: 0};

const shortenUrl = (url: string) => url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");

function Section(props: {title: string, description?: string, children: ReactNode}) {
  return (
    <Card
      variant="borderless"
      title={(
        <Flex vertical style={{padding: "8px 0"}}>
          <span>{props.title}</span>
          {props.description && (
            <Typography.Text type="secondary" style={{fontWeight: "normal", fontSize: 13}}>
              {props.description}
            </Typography.Text>
          )}
        </Flex>
      )}
    >
      <Flex vertical gap="small">
        {props.children}
      </Flex>
    </Card>
  )
}

export default function AdminSiteSettingsView(props: IProps) {
  const {token: {padding, paddingSM}} = theme.useToken();
  const {notification} = App.useApp();
  const router = useRouter();
  const [form] = Form.useForm<ISiteSettingsData>();

  const [isChanged, setIsChanged] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const save = (data: ISiteSettingsData) => {
    setIsSaving(() => true);

    unwrapServerAction(updateSiteSettingsAction(data))
      .then(() => {
        notification.success({title: "Налаштування збережено"});
        setIsChanged(() => false);
        router.refresh();
      })
      .catch((error) => notification.error({title: "Помилка збереження", description: error.message}))
      .finally(() => setIsSaving(() => false));
  }

  const cancel = () => {
    form.resetFields();
    setIsChanged(() => false);
  }

  return (
    <Form<ISiteSettingsData>
      form={form}
      layout="vertical"
      initialValues={props.settings}
      onFinish={save}
      onValuesChange={() => setIsChanged(() => true)}
    >
      <Card
        variant="borderless"
        style={{position: "sticky", top: 0, zIndex: 2, marginBottom: padding}}
        styles={{body: {padding: `${paddingSM}px ${padding}px`}}}
      >
        <Flex align="center" justify="space-between" gap="small" wrap>
          <Typography.Title level={2} style={{margin: 0}}>Налаштування сайту</Typography.Title>
          <Flex gap="small" align="center" wrap>
            {isChanged && <Typography.Text type="secondary">Є незбережені зміни</Typography.Text>}
            <Button onClick={cancel} disabled={!isChanged || isSaving}>
              Відмінити
            </Button>
            <Button type="primary" htmlType="submit" loading={isSaving} disabled={!isChanged}>
              Зберегти
            </Button>
          </Flex>
        </Flex>
      </Card>
      <Row gutter={[padding, padding]}>
        <Col xs={24} xl={14}>
          <Flex vertical gap={padding}>
            <Section title="Сайт" description="Показуються у вкладці браузера та в результатах пошуку">
              <Form.Item<ISiteSettingsData>
                label="Назва сайту"
                name="siteTitle"
                style={itemStyle}
                rules={[{required: true, whitespace: true, message: "Вкажіть назву сайту"}]}
                extra="Заголовок головної сторінки та сторінок без власного заголовка"
              >
                <Input/>
              </Form.Item>
              <Form.Item<ISiteSettingsData>
                label="Коротка назва"
                name="siteShortName"
                style={itemStyle}
                rules={[{required: true, whitespace: true, message: "Вкажіть коротку назву"}]}
                extra="Додається після заголовка сторінки: «Новини — Кафедра ІСТ»"
              >
                <Input/>
              </Form.Item>
              <Form.Item<ISiteSettingsData>
                label="Опис сайту"
                name="siteDescription"
                style={itemStyle}
                extra="Текст під заголовком у пошуку, до 300 символів, для сторінок без власного опису"
              >
                <Input.TextArea autoSize={{minRows: 2, maxRows: 5}} maxLength={300}/>
              </Form.Item>
            </Section>
            <Section title="Футер" description="Показуються внизу кожної сторінки">
              <Form.Item<ISiteSettingsData>
                label="Карта"
                name="mapEmbedUrl"
                style={itemStyle}
                rules={[{
                  validator: (_, value?: string) => (
                    !value || value.includes(MAP_EMBED_URL_PREFIX) ?
                      Promise.resolve() :
                      Promise.reject(new Error("Потрібен код вбудовування з Google Maps"))
                  )
                }]}
                extra="Код з Google Maps: Поділитися → Вбудувати карту"
              >
                <Input.TextArea autoSize={{minRows: 2, maxRows: 4}}/>
              </Form.Item>
              <Form.Item<ISiteSettingsData>
                label="Копірайт"
                name="copyright"
                style={itemStyle}
                extra="Поточний рік додається автоматично"
              >
                <Input/>
              </Form.Item>
            </Section>
          </Flex>
        </Col>
        <Col xs={24} xl={10}>
          <Flex vertical gap={padding}>
            <Section title="Контакти" description="Показуються у футері та в блоці «Зворотній зв'язок»">
              <Form.Item<ISiteSettingsData>
                label="Назва"
                name="organizationName"
                style={itemStyle}
                extra="Заголовок контактів у футері"
              >
                <Input/>
              </Form.Item>
              <Form.Item<ISiteSettingsData>
                label="Графік роботи"
                name="workingHours"
                style={itemStyle}
                extra="Кожен рядок показується окремо"
              >
                <Input.TextArea autoSize={{minRows: 2, maxRows: 5}}/>
              </Form.Item>
              <Row gutter={[padding, 8]}>
                <Col span={24}>
                  <Form.Item<ISiteSettingsData>
                    label="Адреса"
                    name="address"
                    style={itemStyle}
                    extra="Якщо не вказано, не показується"
                  >
                    <Input/>
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item<ISiteSettingsData>
                    label="Посилання на адресу"
                    name="addressLink"
                    style={itemStyle}
                    extra="Відкривається при натисканні на адресу"
                    rules={[{type: "url", message: "Некоректне посилання"}]}
                  >
                    <Input placeholder="https://maps.app.goo.gl/..."/>
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item<ISiteSettingsData>
                    label="Email"
                    name="email"
                    style={itemStyle}
                    rules={[{type: "email", message: "Некоректна адреса пошти"}]}
                    extra="Листи з форми сюди не надходять"
                  >
                    <Input/>
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item<ISiteSettingsData>
                    label="Телефон"
                    name="phone"
                    style={itemStyle}
                    extra="Натискання на номер починає дзвінок"
                    rules={[{pattern: /^[\d\s()+-]*$/, message: "Лише цифри, пробіли, +, -, дужки"}]}
                  >
                    <Input/>
                  </Form.Item>
                </Col>
              </Row>
            </Section>
            <Section title="Соціальні мережі" description="Показуються кнопками у футері">
              <Form.List name="socialLinks">
                {(fields, operations) => (
                  <FormSortableList<ISocialLink>
                    listName="socialLinks"
                    fields={fields}
                    operations={operations}
                    getTitle={(link, index) => {
                      const name = link?.network ? SOCIAL_NETWORK_NAMES[link.network] : `Посилання ${index + 1}`;
                      return link?.url ? `${name} · ${shortenUrl(link.url)}` : name;
                    }}
                    renderFields={(field) => (
                      <>
                        <Form.Item
                          name={[field.name, "network"]}
                          label="Мережа"
                          style={itemStyle}
                          extra="Для іншої мережі оберіть «Інший сайт»"
                          rules={[{required: true, message: "Оберіть мережу"}]}
                        >
                          <Select options={SOCIAL_NETWORK_OPTIONS}/>
                        </Form.Item>
                        <Form.Item
                          name={[field.name, "url"]}
                          label="Посилання"
                          style={itemStyle}
                          extra="Відкривається в новій вкладці"
                          rules={[
                            {required: true, message: "Вкажіть посилання"},
                            {type: "url", message: "Некоректне посилання"}
                          ]}
                        >
                          <Input placeholder="https://"/>
                        </Form.Item>
                      </>
                    )}
                    addLabel="Додати соціальну мережу"
                    createItem={() => ({network: "facebook", url: ""})}
                  />
                )}
              </Form.List>
            </Section>
          </Flex>
        </Col>
      </Row>
    </Form>
  )
}
