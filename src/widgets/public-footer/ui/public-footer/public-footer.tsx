import {Button, Card, Col, Divider, Flex, Layout, Row, theme, Typography} from "antd";
import {ISiteSettingsData} from "@/entities/site-settings";
import {SOCIAL_NETWORK_NAMES} from "@/entities/site-settings/types/type";
import {SocialNetworkIcon} from "@/entities/site-settings/ui";
import {ComponentCol} from "@/shared/ui-kit";
import getPhoneHref from "@/shared/utilities/get-phone-href";
import formatDate from "@/shared/utilities/format-date";

interface IProps {
  settings: ISiteSettingsData;
}

export default function PublicFooter(props: IProps) {
  const {token: {colorTextLightSolid, colorPrimary, paddingLG, paddingXL}} = theme.useToken();
  const settings = props.settings;

  const workingHours = settings.workingHours.split("\n").map((line) => line.trim()).filter(Boolean);
  const hasMap = Boolean(settings.mapEmbedUrl);

  return (
    <Layout.Footer style={{backgroundColor: colorPrimary, padding: `${paddingXL}px 0`}}>
      <ComponentCol width="medium">
        <Row gutter={[paddingLG, paddingLG]} justify="center">
          <Col xs={24} md={12} lg={hasMap ? 8 : 12}>
            <Card variant="borderless" style={{height: "100%"}}>
              <Flex vertical align="center" gap="middle" style={{textAlign: "center"}}>
                {settings.organizationName && (
                  <Typography.Title level={4} style={{margin: 0}}>
                    {settings.organizationName}
                  </Typography.Title>
                )}
                {(workingHours.length != 0 || settings.address) && (
                  <Flex vertical>
                    {workingHours.map((line, index) => (
                      <Typography.Text key={index}>{line}</Typography.Text>
                    ))}
                    {settings.address && (settings.addressLink ? (
                      <Typography.Link href={settings.addressLink} target="_blank">{settings.address}</Typography.Link>
                    ) : (
                      <Typography.Text>{settings.address}</Typography.Text>
                    ))}
                  </Flex>
                )}
                {(settings.phone || settings.email) && (
                  <Flex vertical align="center">
                    {settings.phone && (
                      <Flex gap="small" wrap justify="center">
                        <Typography.Text strong>Телефон:</Typography.Text>
                        <Typography.Link href={getPhoneHref(settings.phone)}>{settings.phone}</Typography.Link>
                      </Flex>
                    )}
                    {settings.email && (
                      <Flex gap="small" wrap justify="center">
                        <Typography.Text strong>Email:</Typography.Text>
                        <Typography.Link href={`mailto:${settings.email}`}>{settings.email}</Typography.Link>
                      </Flex>
                    )}
                  </Flex>
                )}
                {settings.socialLinks.length != 0 && (
                  <Flex gap="small" wrap justify="center">
                    {settings.socialLinks.map((link, index) => (
                      <Button
                        key={index}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        icon={<SocialNetworkIcon network={link.network}/>}
                        aria-label={SOCIAL_NETWORK_NAMES[link.network]}
                        title={SOCIAL_NETWORK_NAMES[link.network]}
                      />
                    ))}
                  </Flex>
                )}
              </Flex>
            </Card>
          </Col>
          {hasMap && (
            <Col xs={24} md={12} lg={16}>
              <Card variant="borderless" size="small" style={{height: "100%"}} styles={{body: {height: "100%"}}}>
                <iframe
                  title="Карта"
                  style={{width: "100%", height: "100%", minHeight: 250, border: 0}}
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  src={settings.mapEmbedUrl}
                />
              </Card>
            </Col>
          )}
        </Row>
        {settings.copyright && (
          <>
            <Divider style={{backgroundColor: colorTextLightSolid}}/>
            <Flex align="center" justify="center">
              <Typography.Text style={{color: colorTextLightSolid, textAlign: "center"}}>
                © Copyright by&nbsp;
                <Typography.Text strong style={{color: colorTextLightSolid}}>
                  {settings.copyright} <span suppressHydrationWarning>{formatDate(Date.now(), "YYYY")}</span>
                </Typography.Text>
              </Typography.Text>
            </Flex>
          </>
        )}
      </ComponentCol>
    </Layout.Footer>
  )
}
