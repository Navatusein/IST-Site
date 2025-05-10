import {Card, Col, Flex, Row, Statistic, StatisticProps, theme, Typography} from "antd";
import {useMemo} from "react";
import {IBasePageComponent} from "@/entities/dynamic-page";
import {IHeroSectionPageComponent} from "../../types/type";
import {DynamicIcon, PageComponentError} from "@/shared/ui-kit";
import NextImage from "next/image";
import style from "./page-component-hero-section.module.scss"
import Link from "next/link";
import {BookOutlined} from "@ant-design/icons";
import CountUp from "react-countup";
import PageComponentHeroSectionEditor from "../page-component-hero-section-editor/page-component-hero-section-editor";

interface IProps {
  componentProps: IBasePageComponent;
}

export default function PageComponentHeroSection(props: IProps) {
  const {token: {colorTextLightSolid, colorPrimary, colorSuccess}} = theme.useToken();

  const typedComponentProps = useMemo(() => {
    if (props.componentProps.type !== "hero-section")
      return null;

    return props.componentProps as IHeroSectionPageComponent;
  }, [props]);

  const formatter: StatisticProps['formatter'] = (value) => (
    <CountUp end={value as number} separator=","/>
  );

  return (
    <PageComponentError message={typedComponentProps == null ? "Fail" : ""}>
      <Flex vertical style={{width: "100%", position: "relative"}}>
        <NextImage
          src={`/files/${typedComponentProps!.imagePath}`}
          alt={typedComponentProps!.title}
          height={typedComponentProps!.imageHeight}
          style={{objectFit: "cover", width: "100%", objectPosition: "50% 30%"}}
          sizes="100vw"
          width={0}
        />
        <Flex
          className={style.flexContainerMiddle}
          align="end"
          justify="flex-end"
        >
          <Flex
            vertical
            className={style.flexContainerInfo}
            align="center"
            justify="center"
          >
            <Flex
              vertical
              className={style.flexContainerInfoContent}
              gap="middle"
            >
              <Typography.Title level={1} style={{color: colorTextLightSolid, margin: 0}}>
                {typedComponentProps!.title}
              </Typography.Title>
              <Card size="small">
                <Typography.Text strong style={{margin: 0, whiteSpace: "pre-wrap"}}>
                  {typedComponentProps!.text}
                </Typography.Text>
              </Card>
            </Flex>
          </Flex>
          <Flex className={style.flexContainerFastLinks}>
            {typedComponentProps!.fastLinks.map((fastLink, index) => (
              <Col
                sm={8}
                md={24}
                className={style.card}
                style={{backgroundColor: (index % 2 ? colorSuccess : colorPrimary)}}
                key={`fastLink-${index}`}
              >
                <Link href={fastLink.path}>
                  <Typography.Title level={4} style={{color: colorTextLightSolid, margin: 0}}>
                    {fastLink.title}
                  </Typography.Title>
                </Link>
              </Col>
            ))}
          </Flex>
        </Flex>
      </Flex>
      <Row>
        {typedComponentProps!.statistics.map((statistic, index) => (
          <Col md={6} xs={12} key={`statistic-${index}`}>
            <Card style={{height: "100%"}} styles={{body: {height: "100%"}}}>
              <Flex vertical justify="space-between" style={{height: "100%"}}>
                <Typography.Text type="secondary">
                  {statistic.title}
                </Typography.Text>
                <Statistic value={statistic.value} formatter={formatter} prefix={<DynamicIcon name={statistic.icon}/>}/>
              </Flex>
            </Card>
          </Col>
        ))}
      </Row>
    </PageComponentError>
  )
}

PageComponentHeroSection.Editor = PageComponentHeroSectionEditor;
