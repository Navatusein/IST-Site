"use client"

import styles from "./component.module.scss";
import {theme} from "antd";
import {useMemo} from "react";

interface IProps {
  width: "small" | "medium" | "large";
}

export default function Component(props: IProps) {
  const {token: {}} = theme.useToken();

  const typedComponent = {
    type: "cards",
    width: props.width,
  }

  const colConfigs = useMemo(() => {
    if (typedComponent.width == "small"){
      return {};
    }
    else {
      return {}
    }
  }, [typedComponent.width]);

  return (
    <>

    </>
  )
}

