import {Card, Col, Flex, Row, theme, Typography} from "antd";
import {IPageComponentViewProps, usePageComponentData} from "@/entities/dynamic-page/model";
import {PageLinkButton} from "@/features/page-link";
import {ILinkCardsPageComponent, LinkCardsData} from "../../types/type";

export default function LinkCards(props: IPageComponentViewProps<ILinkCardsPageComponent, LinkCardsData>) {
  const {token: {padding, paddingXS, colorTextHeading}} = theme.useToken();

  const files = usePageComponentData(props.component, props.data) ?? {};

  const {columns, showNumbers, buttonText, buttonVariant} = props.component;
  const cards = (props.component.cards ?? []).filter((card) => card?.title?.trim());

  return (
    <Row gutter={[padding, padding]}>
      {cards.map((card, index) => (
        <Col key={`card-${index}`} xs={24} sm={12} md={24 / Math.min(columns, 3)} lg={24 / columns}>
          <Card
            variant="borderless"
            style={{height: "100%"}}
            styles={{body: {height: "100%", display: "flex", flexDirection: "column", gap: paddingXS}}}
          >
            {showNumbers && (
              <Flex vertical align="center" gap={paddingXS} style={{alignSelf: "flex-start", marginBottom: paddingXS}}>
                <Typography.Title level={2} style={{margin: 0, lineHeight: 1}}>
                  {index + 1}
                </Typography.Title>
                <div style={{width: 32, height: 2, background: colorTextHeading}}/>
              </Flex>
            )}
            <Typography.Title level={4} style={{margin: 0}}>
              {card.title}
            </Typography.Title>
            {card.description?.trim() && (
              <Typography.Paragraph style={{margin: 0, whiteSpace: "pre-line"}}>
                {card.description}
              </Typography.Paragraph>
            )}
            {card.linkType != "none" && (
              <div style={{marginTop: "auto", paddingTop: paddingXS}}>
                <PageLinkButton
                  link={card}
                  file={card.linkType == "file" ? files[card.link] : undefined}
                  type={buttonVariant}
                  block
                >
                  {card.buttonText?.trim() || buttonText}
                </PageLinkButton>
              </div>
            )}
          </Card>
        </Col>
      ))}
    </Row>
  )
}
