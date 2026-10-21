"use client"

import {CSSProperties, ReactNode} from "react";
import {Card} from "antd";
import {IPageComponentGroup} from "../../types/type";

interface IProps {
  group: IPageComponentGroup;
  children: ReactNode;
  style?: CSSProperties;
}

export default function PageGroupCell(props: IProps) {
  if (!props.group.cards)
    return props.children;

  return (
    <Card
      style={{height: "100%", ...props.style}}
      styles={{
        body: {
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: props.group.verticalAlign == "center" ? "center" : "flex-start"
        }
      }}
    >
      {props.children}
    </Card>
  )
}
