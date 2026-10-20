import {Card, Col, Flex, Image, Row, Typography} from "antd";
import {RichTextRenderer} from "@/features/rich-text-renderer";
import {IPageComponentViewProps} from "@/entities/dynamic-page/model";
import {getFileAssetUrl} from "@/shared/utilities/file-urls";
import FastLink from "../fast-link/fast-link";
import Statistic from "../statistic/statistic";
import {IHeroSectionMainPageComponent} from "../../types/type";
import styles from "./hero-section-main.module.scss";

export default function HeroSectionMain(props: IPageComponentViewProps<IHeroSectionMainPageComponent>) {
  return (
    <Flex vertical>
      <Flex vertical className={styles.titleBaseContainer}>
        <Image
          src={getFileAssetUrl(props.component.imageSlug) ?? "/missing-image.webp"}
          fallback="/missing-image.webp"
          preview={false}
          height={props.component.imageHeight}
          width={"100%"}
          className={styles.image}
          loading={"lazy"}
        />
        <Flex vertical gap="small" className={styles.titleFlexContainer}>
          <Typography.Title className={styles.titleTypography}>
            {props.component.department}
          </Typography.Title>
          <Typography.Title level={3} className={styles.titleTypography}>
            {props.component.faculty}
          </Typography.Title>
          <Typography.Title level={3} className={styles.titleTypography}>
            {props.component.university}
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
              <RichTextRenderer content={props.component.text}/>
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
            {props.component.fastLinks.map((fastLink, index) => (
              <FastLink key={`fastLink-${index}`} fastLink={fastLink}/>
            ))}
          </Flex>
        </Col>
      </Row>
      <Row gutter={[2, 2]}>
        {props.component.statistics.map((statistic, index) => (
          <Statistic key={`statistic-${index}`} statistic={statistic}/>
        ))}
      </Row>
    </Flex>
  )
}
