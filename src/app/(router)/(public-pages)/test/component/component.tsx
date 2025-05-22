"use client"

import {Button, Card, Col, Flex, Form, Input, Row, theme, Typography} from "antd";
import {EnvironmentOutlined, MailOutlined, PhoneOutlined} from "@ant-design/icons";
import {useMemo} from "react";

interface IProps {
  width: "medium" | "large";
}

export default function Component(props: IProps) {
  const typedComponentProps = {
    type: "contact-us",
    width: props.width
  }

  const {token: {padding, paddingXS}} = theme.useToken();

  const config = useMemo(() => {
    switch (typedComponentProps.width) {
      case "medium":
        return {}
      case "large":
      default:
        return {}
    }
  }, [typedComponentProps.width])

  return (
    <>
      
    </>
  )
}