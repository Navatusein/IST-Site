import {useEffect, useState} from "react";
import {Flex, Form, Input, Switch} from "antd";
import {IPageComponentEditorProps} from "@/entities/dynamic-page/model";
import type {ISiteContacts} from "@/entities/site-settings";
import {getSiteSettingsAction} from "@/entities/site-settings/actions/actions";
import {unwrapServerAction} from "@/shared/utilities/unwrap-server-action";
import {EditorForm} from "@/shared/ui-kit";
import {IContactUsPageComponent} from "../../types/type";

export default function ContactUsEditor(props: IPageComponentEditorProps<IContactUsPageComponent>) {
  const [form] = Form.useForm<IContactUsPageComponent>();
  const [siteContacts, setSiteContacts] = useState<ISiteContacts | null>(null);

  useEffect(() => {
    unwrapServerAction(getSiteSettingsAction())
      .then((settings) => setSiteContacts(() => settings))
      .catch((error) => console.error(error));
  }, []);

  const value = {...props.component, useSiteContacts: props.component.useSiteContacts != false};

  const onChange = (next: IContactUsPageComponent) => {
    const isSwitchedToOwn = next.useSiteContacts == false && props.component.useSiteContacts != false;
    const hasOwnContacts = Boolean(next.address || next.addressLink || next.email || next.phone);

    if (isSwitchedToOwn && !hasOwnContacts && siteContacts) {
      const {address, addressLink, email, phone} = siteContacts;
      form.setFieldsValue({address, addressLink, email, phone});
      next = form.getFieldsValue(true);
    }

    props.onChange(next);
  }

  return (
    <EditorForm form={form} value={value} onChange={onChange}>
      <Flex vertical gap="small">
        <Form.Item<IContactUsPageComponent>
          label="Контакти з налаштувань сайту"
          name="useSiteContacts"
          valuePropName="checked"
          style={{marginBottom: 0}}
          extra="Змінюються в адмінці, в «Налаштуваннях сайту»"
        >
          <Switch/>
        </Form.Item>
        {value.useSiteContacts == false && (
          <>
            <Form.Item<IContactUsPageComponent>
              label="Адреса"
              name="address"
              style={{marginBottom: 0}}
              extra="Якщо не вказано, картка не показується"
            >
              <Input/>
            </Form.Item>
            <Form.Item<IContactUsPageComponent>
              label="Посилання на мапу"
              name="addressLink"
              style={{marginBottom: 0}}
              rules={[{type: "url", message: "Некоректне посилання"}]}
              extra="Наприклад, з Google Maps"
            >
              <Input placeholder="https://maps.app.goo.gl/..."/>
            </Form.Item>
            <Form.Item<IContactUsPageComponent>
              label="Email"
              name="email"
              style={{marginBottom: 0}}
              rules={[{type: "email", message: "Некоректна адреса пошти"}]}
              extra="Лише показується на сторінці, листи з форми сюди не надходять"
            >
              <Input/>
            </Form.Item>
            <Form.Item<IContactUsPageComponent>
              label="Телефон"
              name="phone"
              style={{marginBottom: 0}}
              rules={[{pattern: /^[\d\s()+-]*$/, message: "Лише цифри, пробіли, +, -, дужки"}]}
              extra="Якщо не вказано, картка не показується"
            >
              <Input/>
            </Form.Item>
          </>
        )}
      </Flex>
    </EditorForm>
  )
}
