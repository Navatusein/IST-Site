import {Card, Col, Row, theme} from "antd";
import {EnvironmentOutlined, MailOutlined, PhoneOutlined} from "@ant-design/icons";
import {IPageComponentViewProps, usePageComponentData} from "@/entities/dynamic-page/model";
import type {ISiteContacts} from "@/entities/site-settings";
import getPhoneHref from "@/shared/utilities/get-phone-href";
import {IContactUsContacts, IContactUsPageComponent} from "../../types/type";
import ContactCard from "../contact-card/contact-card";
import ContactUsForm from "../contact-us-form/contact-us-form";

export default function ContactUs(props: IPageComponentViewProps<IContactUsPageComponent, ISiteContacts>) {
  const {token: {padding}} = theme.useToken();

  const siteContacts = usePageComponentData<ISiteContacts>(props.component, props.data);

  const {address, addressLink, email, phone}: IContactUsContacts =
    props.component.useSiteContacts != false ? (siteContacts ?? {}) : props.component;

  const contactSpan = email && phone ? 12 : 24;
  const hasContacts = Boolean(address || email || phone);

  return (
    <Row gutter={[padding, padding]}>
      {hasContacts && (
        <Col xs={24} md={12}>
          <Row gutter={[padding, padding]}>
            {address && (
              <Col span={24}>
                <ContactCard icon={<EnvironmentOutlined/>} title="Наша адреса" text={address} href={addressLink || undefined}/>
              </Col>
            )}
            {email && (
              <Col xs={24} sm={contactSpan}>
                <ContactCard icon={<MailOutlined/>} title="Email" text={email} href={`mailto:${email}`}/>
              </Col>
            )}
            {phone && (
              <Col xs={24} sm={contactSpan}>
                <ContactCard icon={<PhoneOutlined/>} title="Телефон" text={phone} href={getPhoneHref(phone)}/>
              </Col>
            )}
          </Row>
        </Col>
      )}
      <Col xs={24} md={hasContacts ? 12 : 24}>
        <Card variant="borderless" style={{height: "100%"}}>
          <ContactUsForm/>
        </Card>
      </Col>
    </Row>
  )
}
