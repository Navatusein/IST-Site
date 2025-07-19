"use client"

// import styles from "./component.module.scss";
import {theme} from "antd";
import {useMemo} from "react";

interface IProps {
  width: "small" | "medium" | "large";
}

export default function Component(props: IProps) {
  const {token: {}} = theme.useToken();

  const typedComponentProps = {
    type: "cards",
    width: props.width,
  }

  // const colConfigs = useMemo(() => {
  //   if (typedComponentProps.width == "small"){
  //     return {};
  //   }
  //   else {
  //     return {}
  //   }
  // }, [typedComponentProps.width]);

  return (
    <>

    </>
  )
}

