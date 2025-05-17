import {Card, Col, Flex, StatisticProps, theme, Statistic as AntStatistic, Typography} from "antd";
import CountUp from "react-countup";
import {IHeroSectionMainStatistics} from "@/page-components/hero-section-main/types/type";

interface IProps {
  statistic: IHeroSectionMainStatistics
}

export default function Statistic(props: IProps) {
  const {token: {fontSizeHeading1,}} = theme.useToken();

  const formatter: StatisticProps['formatter'] = (value) => (
    <CountUp scrollSpyOnce end={value as number} separator="," style={{fontSize: fontSizeHeading1, fontWeight: 600}}/>
  );

  return (
    <Col xs={12} lg={6} md={12}>
      <Card style={{height: "100%", border: 0, borderRadius: 0}} styles={{body: {height: "100%"}}}>
        <Flex vertical justify="start" align="center" style={{height: "100%"}}>
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
