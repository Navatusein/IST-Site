import {Card, Col, Flex, Layout, Row, Typography, theme, Button, Divider} from "antd";
import {FacebookFilled, InstagramFilled, LinkedinFilled} from "@ant-design/icons";
import Link from "next/link";
import {ComponentCol} from "@/shared/ui-kit";

interface IProps {

}

const MAP_LINK = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d755.211644622456!2d30.47420755218459!3d50.455645356251054!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40d4ce80bb14c36b%3A0x31d104253e38d4e0!2z0KTQsNC60YPQu9GM0YLQtdGCINGW0L3RhNC-0YDQvNCw0YbRltC50L3QuNGFINGC0LXRhdC90L7Qu9C-0LPRltC5INCa0LjRl9Cy0YHRjNC60L7Qs9C-INC90LDRhtGW0L7QvdCw0LvRjNC90L7Qs9C-INGD0L3RltCy0LXRgNGB0LjRgtC10YLRgyDRltC80LXQvdGWINCi0LDRgNCw0YHQsCDQqNC10LLRh9C10L3QutCw!5e0!3m2!1suk!2sua!4v1747509912322!5m2!1suk!2sua"

export default function PublicFooter(props: IProps) {
  const {token: {colorTextLightSolid, colorPrimary, paddingLG, paddingXL}} = theme.useToken();

  return (
    <Layout.Footer style={{backgroundColor: colorPrimary, padding: `${paddingXL}px 0`}}>
      <ComponentCol width="medium">
        <Row gutter={[paddingLG, paddingLG]}>
          <Col
            xs={{span: 24}}
            md={{span: 12}}
            lg={{span: 8}}
          >
            <Card variant="borderless">
              <Flex vertical align="center" gap="middle">
                <Typography.Title level={4} style={{textAlign: "center", margin: 0}}>
                  Кафедра інформаційних систем на технологій
                </Typography.Title>
                <Flex vertical>
                  <Typography.Text style={{textAlign: "center"}}>
                    Понеділок-п’ятниця: 8:00 – 18:00
                  </Typography.Text>
                  <Typography.Text style={{textAlign: "center"}}>
                    Субота & Неділя: Вихідний
                  </Typography.Text>
                  <Typography.Link style={{textAlign: "center"}} href={"https://maps.app.goo.gl/wEdHhfHdVc15HExb9"}>
                    вул. Богдана Гаврилишина, 24,<br/>Київ, Україна
                  </Typography.Link>
                </Flex>
                <Flex vertical align="center">
                  <Flex gap="small">
                    <Typography.Text strong style={{textAlign: "center"}}>
                      Телефон:
                    </Typography.Text>
                    <Typography.Link href={"tel:+380445213356"}>
                      044 521 33 56
                    </Typography.Link>
                  </Flex>
                  <Flex gap="small">
                    <Typography.Text strong style={{textAlign: "center"}}>
                      Email:
                    </Typography.Text>
                    <Typography.Link href={"mailto:ist@fit.knu.ua"}>
                      ist@fit.knu.ua
                    </Typography.Link>
                  </Flex>
                </Flex>
                <Flex gap="small">
                  <Link href={"https://www.facebook.com/ist.knu.ua"}>
                    <Button icon={<FacebookFilled/>}/>
                  </Link>
                  <Link href={"https://www.instagram.com/ist.fit.knu/"}>
                    <Button icon={<InstagramFilled/>}/>
                  </Link>
                </Flex>
              </Flex>
            </Card>
          </Col>
          <Col
            xs={{span: 24}}
            md={{span: 12}}
            lg={{span: 16}}
          >
            <Card variant="borderless" size="small" style={{height: "100%"}} styles={{body: {height: "100%"}}}>
              <iframe
                style={{width: "100%", height: "100%", border: 0}}
                loading="lazy"
                allowFullScreen
                src={MAP_LINK}
              />
            </Card>
          </Col>
        </Row>
        <Divider style={{backgroundColor: colorTextLightSolid}}/>
        <Flex align="center" justify="center">
          <Typography.Text style={{color: colorTextLightSolid, textAlign: "center"}}>
            © Copyright by&nbsp;
            <Typography.Text strong style={{color: colorTextLightSolid}}>
              Department of Information Systems and Technology (TSNUK) 2025
            </Typography.Text>
          </Typography.Text>
        </Flex>
      </ComponentCol>
    </Layout.Footer>
  )
}
