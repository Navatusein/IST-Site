"use client"

import {Button, Card, Flex, theme, Typography} from "antd";
import {useAnalyticsConsent} from "../../hooks/use-analytics-consent";
import {setAnalyticsConsent} from "../../model/consent-store";

export default function AnalyticsConsentBanner() {
  const {token: {boxShadowSecondary, zIndexPopupBase}} = theme.useToken();
  const {isBannerOpen} = useAnalyticsConsent();

  if (!isBannerOpen)
    return null;

  return (
    <Card
      role="region"
      aria-label="Згода на файли cookie"
      size="small"
      style={{
        position: "fixed",
        left: 16,
        bottom: 16,
        width: "calc(100% - 32px)",
        maxWidth: 420,
        zIndex: zIndexPopupBase,
        boxShadow: boxShadowSecondary
      }}
    >
      <Flex vertical gap="middle">
        <Typography.Text>
          Сайт використовує Google Analytics, щоб зрозуміти, які сторінки корисні відвідувачам.
          Дозволити файли cookie аналітики? Рекламних cookie сайт не використовує.
        </Typography.Text>
        <Flex gap="small" justify="flex-end">
          <Button onClick={() => setAnalyticsConsent("denied")}>Відхилити</Button>
          <Button type="primary" onClick={() => setAnalyticsConsent("granted")}>Дозволити</Button>
        </Flex>
      </Flex>
    </Card>
  )
}
