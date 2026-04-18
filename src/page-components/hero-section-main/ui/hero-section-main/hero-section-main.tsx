import {useMemo} from "react";
import {IBasePageComponent} from "@/entities/dynamic-page";
import {PageComponentError} from "@/shared/ui-kit";
import HeroSectionMainEditor from "../hero-section-main-editor/hero-section-main-editor";
import FastLink from "../fast-link/fast-link";
import Statistic from "../statistic/statistic";
import {IHeroSectionMainPageComponent} from "../../types/type";
import {Card, Col, Flex, Image, Row, Typography} from "antd";
import {RichTextRenderer} from "../../../../features/rich-text-renderer";
import styles from "./hero-section-main.module.scss";

interface IProps {
  component: IBasePageComponent;
}

export default function HeroSectionMain(props: IProps) {
  const typedComponent = useMemo(() => {
    if (props.component.componentType !== "hero-section-main")
      return null;

    return props.component as IHeroSectionMainPageComponent;
  }, [props]);

  return (
    <PageComponentError component={typedComponent}>
      <Flex vertical>
        <Flex vertical className={styles.titleBaseContainer}>
          <Image
            src={`/api/assets${typedComponent!.imagePath}`}
            fallback="/missing-image.webp"
            preview={false}
            height={typedComponent!.imageHeight}
            width={"100%"}
            className={styles.image}
            loading={"lazy"}
          />
          <Flex vertical gap="small" className={styles.titleFlexContainer}>
            <Typography.Title className={styles.titleTypography}>
              {typedComponent!.department}
            </Typography.Title>
            <Typography.Title level={3} className={styles.titleTypography}>
              {typedComponent!.faculty}
            </Typography.Title>
            <Typography.Title level={3} className={styles.titleTypography}>
              {typedComponent!.university}
            </Typography.Title>
          </Flex>
        </Flex>
        <Row>
          <Col
            md={{span: 24, offset: 0}}
            lg={{span: 12, offset: 2}}
            xl={{span: 12, offset: 3}}
            xxl={{span: 10, offset: 4}}
          >
            <Flex vertical align="center" justify="center" className={styles.textFlexContainer}>
              <Card variant="borderless" className={styles.textCardContainer}>
                <RichTextRenderer content={typedComponent!.text}/>
              </Card>
            </Flex>
          </Col>
          <Col
            xs={{span: 24, offset: 0}}
            lg={{span: 8, offset: 2}}
            xl={{span: 6, offset: 3}}
            xxl={{span: 6, offset: 4}}
          >
            <Flex vertical className={styles.fastLinkFlexContainer}>
              {typedComponent!.fastLinks.map((fastLink, index) => (
                <FastLink key={`fastLink-${index}`} fastLink={fastLink}/>
              ))}
            </Flex>
          </Col>
        </Row>
        <Row gutter={[2, 2]}>
          {typedComponent!.statistics.map((statistic, index) => (
            <Statistic key={`statistic-${index}`} statistic={statistic}/>
          ))}
        </Row>
      </Flex>
    </PageComponentError>
  )
}

HeroSectionMain.Editor = HeroSectionMainEditor