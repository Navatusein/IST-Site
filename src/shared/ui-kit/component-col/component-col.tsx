import {Col, theme} from "antd";
import {ReactNode} from "react";

interface IProps {
  width: "medium" | "large";
  children: ReactNode;
}

const COL_CONFIG = {
  "medium": {
    sm: {span: 24, offset: 0},
    md: {span: 20, offset: 2},
    lg: {span: 18, offset: 4},
    xl: {span: 14, offset: 5},
    xxl: {span: 12, offset: 6},
  },
  "large": {
    span: 24
  }
}

export default function ComponentCol(props: IProps) {
  const {token: {padding}} = theme.useToken();

  return (
    <Col {...COL_CONFIG[props.width]}>
      <div style={{margin: props.width != "large" ? `0 ${padding}px` : "unset"}}>
        {props.children}
      </div>
    </Col>
  )
}
