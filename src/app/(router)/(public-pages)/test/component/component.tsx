"use client"

import {Card, Carousel, Image, theme} from "antd";
import {useMemo} from "react";
import styles from "./component.module.scss";

interface IProps {
  width: "medium" | "large";
}

export default function Component(props: IProps) {
  const typedComponentProps = {
    type: "contact-us",
    width: props.width,
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