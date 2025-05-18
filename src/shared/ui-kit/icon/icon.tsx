import {Flex, Image, Typography} from "antd";
import {CSSProperties} from "react";

interface IProps {
  showText?: boolean;
  iconSize?: number;
  level?: 1|2|3|4|5;
  rows?: number;
  vertical?: boolean;
  style?: CSSProperties;
}

export default function Icon(props: IProps) {
  return (
    <Flex
      align="center"
      gap="small"
      vertical={props.vertical}
      style={{padding: "8px", overflow: "hidden", ...props.style}}
    >
      <Image
        src="/icon.webp"
        preview={false}
        style={{width: props.iconSize ?? "48px", height: props.iconSize ?? "48px"}}
        loading={"lazy"}
      />
      {props.showText &&
        props.level ?
          <Typography.Title
            level={props.level}
            style={{margin: 0, textWrap: "wrap", textAlign: props.vertical ? "center" : "unset"}}
            ellipsis={{rows: props.rows ?? 2}}
          >
            КАФЕДРА ІНФОРМАЦІЙНИХ СИСТЕМ ТА ТЕХНОЛОГІЙ
          </Typography.Title> :
          <Typography.Paragraph
            strong
            style={{margin: 0, textWrap: "wrap", textAlign: props.vertical ? "center" : "unset"}}
            ellipsis={{rows: props.rows ?? 2}}
          >
            КАФЕДРА ІНФОРМАЦІЙНИХ СИСТЕМ ТА ТЕХНОЛОГІЙ
          </Typography.Paragraph>
      }
    </Flex>
  )
}