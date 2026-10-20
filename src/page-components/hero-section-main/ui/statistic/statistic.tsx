import {useRef} from "react";
import {Card, Col, Flex, StatisticProps, theme, Statistic as AntStatistic, Typography} from "antd";
import CountUp from "react-countup";
import {useInView} from "@/shared/hooks/use-in-view";
import {useMediaQuery} from "@/shared/hooks/use-media-query";
import {IHeroSectionMainStatistics} from "../../types/type";

interface IProps {
  statistic: IHeroSectionMainStatistics
}

export default function Statistic(props: IProps) {
  const {token: {fontSizeHeading1,}} = theme.useToken();

  const containerRef = useRef<HTMLDivElement>(null);

  const prefersReducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");

  const isInView = useInView(containerRef, {once: true, threshold: 0.5});

  const numberStyle = {fontSize: fontSizeHeading1, fontWeight: 600};

  const formatter: StatisticProps["formatter"] = (value) => {
    if (prefersReducedMotion)
      return <span style={numberStyle}>{Number(value).toLocaleString("en-US")}</span>;

    if (!isInView)
      return <span style={numberStyle}>0</span>;

    return <CountUp start={0} end={value as number} separator="," style={numberStyle}/>;
  };

  return (
    <Col xs={12} lg={6} md={12}>
      <Card style={{height: "100%", border: 0, borderRadius: 0}} styles={{body: {height: "100%"}}}>
        <Flex ref={containerRef} vertical justify="start" align="center" style={{height: "100%"}}>
          <AntStatistic
            value={props.statistic.value}
            formatter={formatter}
          />
          <Typography.Title level={4} style={{wordBreak: "break-word", textAlign: "center"}}>
            {props.statistic.title}
          </Typography.Title>
        </Flex>
      </Card>
    </Col>
  )
}
