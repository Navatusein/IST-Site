"use client"

import {ReactNode} from "react";
import {Flex, theme} from "antd";

interface IProps {
  color?: "primary" | "warning";
  children: ReactNode;
}

export const ACTION_BAR_HEIGHT = 48;

export default function ActionBar(props: IProps) {
  const {token} = theme.useToken();

  const isWarning = props.color == "warning";

  return (
    <Flex
      gap={token.paddingXS}
      align="center"
      wrap
      style={{
        minHeight: ACTION_BAR_HEIGHT,
        padding: `${token.paddingXS}px ${token.paddingXS}px ${token.paddingXS}px ${token.padding}px`,
        borderRadius: token.borderRadiusLG,
        border: `1px solid ${isWarning ? token.colorWarningBorder : token.colorPrimaryBorder}`,
        background: isWarning ? token.colorWarningBg : token.colorPrimaryBg
      }}
    >
      {props.children}
    </Flex>
  )
}
