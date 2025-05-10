import {Flex, Image, Typography} from "antd";
import {CSSProperties} from "react";

interface IProps {
  showText: boolean;
  style?: CSSProperties;
}

export default function Icon(props: IProps) {
  return (
    <Flex
      align="center"
      gap="small"
      style={{padding: "8px", height: "64px", overflow: "hidden", ...props.style}}
    >
      <Image src="/icon.webp" preview={false} style={{width: "48px", height: "48px"}}/>
      {props.showText &&
        <Typography.Paragraph strong style={{margin: 0, textWrap: "wrap"}} ellipsis={{rows: 2}}>
          КАФЕДРА ІНФОРМАЦІЙНИХ СИСТЕМ ТА ТЕХНОЛОГІЙ
        </Typography.Paragraph>
      }
    </Flex>
  )
}