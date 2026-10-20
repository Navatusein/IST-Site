import {ReactNode} from "react";
import {Card, Flex, Typography} from "antd";

interface IProps {
  icon: ReactNode;
  title: string;
  text: string;
  href?: string;
}

export default function ContactCard(props: IProps) {
  return (
    <Card variant="borderless" style={{height: "100%"}}>
      <Flex vertical align="center" gap="small">
        <span style={{fontSize: 32, lineHeight: 1}}>{props.icon}</span>
        <Typography.Title level={4} style={{margin: 0}}>
          {props.title}
        </Typography.Title>
        {props.href ? (
          <Typography.Link href={props.href} style={{textAlign: "center", overflowWrap: "anywhere"}}>
            {props.text}
          </Typography.Link>
        ) : (
          <Typography.Text style={{textAlign: "center", overflowWrap: "anywhere"}}>
            {props.text}
          </Typography.Text>
        )}
      </Flex>
    </Card>
  )
}
