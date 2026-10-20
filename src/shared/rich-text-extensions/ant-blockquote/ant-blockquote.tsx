"use client"

import {ReactNode} from "react";
import {theme, Typography} from "antd";

export default function AntBlockquote(props: {children?: ReactNode}) {
  const {token: {colorBorderSecondary, paddingLG, colorTextSecondary}} = theme.useToken();

  return (
    <Typography.Paragraph
      italic
      style={{
        borderLeft: `4px solid ${colorBorderSecondary}`,
        paddingLeft: paddingLG,
        color: colorTextSecondary
      }}
    >
      {props.children}
    </Typography.Paragraph>
  )
}
