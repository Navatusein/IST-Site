import {Card, Col, Flex, Layout, Row, Typography, theme, Button, Divider} from "antd";
import {FacebookFilled, InstagramFilled, LinkedinFilled} from "@ant-design/icons";

interface IProps {

}

//https://mapembeds.com/?gad_source=1&gad_campaignid=22378482871&gbraid=0AAAAADsyavW8ts1GJDMUaFlB66Ig_eF1L&gclid=CjwKCAjw56DBBhAkEiwAaFsG-r3czK4rFeN8F4YOn5e9JE07ZSo0mFIwsJz5phfoJs8vDTQchZG2-RoCXgQQAvD_BwE
const MAP_LINK = "https://maps.google.com/maps?q=%D0%A4%D0%B0%D0%BA%D1%83%D0%BB%D1%8C%D1%82%D0%B5%D1%82+%D1%96%D0%BD%D1%84%D0%BE%D1%80%D0%BC%D0%B0%D1%86%D1%96%D0%B9%D0%BD%D0%B8%D1%85+%D1%82%D0%B5%D1%85%D0%BD%D0%BE%D0%BB%D0%BE%D0%B3%D1%96%D0%B9+%D0%9A%D0%B8%D1%97%D0%B2%D1%81%D1%8C%D0%BA%D0%BE%D0%B3%D0%BE+%D0%BD%D0%B0%D1%86%D1%96%D0%BE%D0%BD%D0%B0%D0%BB%D1%8C%D0%BD%D0%BE%D0%B3%D0%BE+%D1%83%D0%BD%D1%96%D0%B2%D0%B5%D1%80%D1%81%D0%B8%D1%82%D0%B5%D1%82%D1%83+%D1%96%D0%BC%D0%B5%D0%BD%D1%96+%D0%A2%D0%B0%D1%80%D0%B0%D1%81%D0%B0+%D0%A8%D0%B5%D0%B2%D1%87%D0%B5%D0%BD%D0%BA%D0%B0&z=18&output=embed"

export default function PublicFooter(props: IProps) {
  const {token: {colorTextLightSolid, colorPrimary, paddingLG}} = theme.useToken();

  return (
    <Layout.Footer style={{backgroundColor: colorPrimary, padding: paddingLG}}>
      <Col
        md={{span: 24, offset: 0}}
        lg={{span: 22, offset: 1}}
        xl={{span: 20, offset: 2}}
        xxl={{span: 16, offset: 4}}
      >
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
                  <Typography.Text style={{textAlign: "center"}}>
                    вул. Богдана Гаврилишина, 24
                  </Typography.Text>
                  <Typography.Text style={{textAlign: "center"}}>
                    Київ, Україна
                  </Typography.Text>
                </Flex>
                <Flex vertical align="center">
                  <Flex gap="small">
                    <Typography.Text strong style={{textAlign: "center"}}>
                      Телефон:
                    </Typography.Text>
                    <Typography.Link href={"tel: +38 044 521 33 56"}>
                      +38 044 521 33 56
                    </Typography.Link>
                  </Flex>
                  <Flex gap="small">
                    <Typography.Text strong style={{textAlign: "center"}}>
                      Email:
                    </Typography.Text>
                    <Typography.Link href={"email: ist@fit.knu.ua"}>
                      ist@fit.knu.ua
                    </Typography.Link>
                  </Flex>
                </Flex>
                <Flex gap="small">
                  <Button icon={<FacebookFilled/>}/>
                  <Button icon={<InstagramFilled/>}/>
                  <Button icon={<LinkedinFilled/>}/>
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
      </Col>
    </Layout.Footer>
  )
}
