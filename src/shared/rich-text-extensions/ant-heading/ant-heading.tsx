import {CSSProperties, ReactNode} from "react";
import {Typography} from "antd";

interface IProps {
  level: number;
  textAlign?: CSSProperties["textAlign"] | null;
  children?: ReactNode;
}

export default function AntHeading(props: IProps) {
  const level = Math.min(Math.max(props.level || 1, 1), 5) as 1 | 2 | 3 | 4 | 5;

  return (
    <Typography.Title level={level} style={{textAlign: props.textAlign ?? "left"}}>
      {props.children}
    </Typography.Title>
  )
}
