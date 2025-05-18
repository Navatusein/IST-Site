import {useMemo} from "react";
import {IBasePageComponent} from "@/entities/dynamic-page";
import {PageComponentError} from "@/shared/ui-kit";
import HeroSectionMainEditor from "../hero-section-main-editor/hero-section-main-editor";
import FastLink from "../fast-link/fast-link";
import Statistic from "../statistic/statistic";
import {IHeroSectionMainPageComponent} from "../../types/type";
import {Card, Col, Flex, Image, Row, Typography} from "antd";
import {MarkdownRenderer} from "@/features/markdown-renderer";
import styles from "./hero-section-main.module.scss";

interface IProps {
  componentProps: IBasePageComponent;
}

export default function HeroSectionMain(props: IProps) {
  const typedComponentProps = useMemo(() => {
    if (props.componentProps.type !== "hero-section-main")
      return null;

    return props.componentProps as IHeroSectionMainPageComponent;
  }, [props]);

  return (
    <PageComponentError message={typedComponentProps == null ? "Fail" : ""}>
      <Flex vertical>
        <Flex vertical className={styles.titleBaseContainer}>
          <Image
            src={`/api/assets${typedComponentProps!.imagePath}`}
            preview={false}
            height={typedComponentProps!.imageHeight}
            width={"100%"}
            className={styles.image}
            loading={"lazy"}
          />
          <Flex vertical gap="small" className={styles.titleFlexContainer}>
            <Typography.Title className={styles.titleTypography}>
              {typedComponentProps!.department}
            </Typography.Title>
            <Typography.Title level={3} className={styles.titleTypography}>
              {typedComponentProps!.faculty}
            </Typography.Title>
            <Typography.Title level={3} className={styles.titleTypography}>
              {typedComponentProps!.university}
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
                <MarkdownRenderer content={typedComponentProps!.text}/>
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
              {typedComponentProps!.fastLinks.map((fastLink, index) => (
                <FastLink key={`fastLink-${index}`} fastLink={fastLink}/>
              ))}
            </Flex>
          </Col>
        </Row>
        <Row gutter={[2, 2]}>
          {typedComponentProps!.statistics.map((statistic, index) => (
            <Statistic key={`statistic-${index}`} statistic={statistic}/>
          ))}
        </Row>
      </Flex>
    </PageComponentError>
  )
}

HeroSectionMain.Editor = HeroSectionMainEditor