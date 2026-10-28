"use client"

import {CSSProperties} from "react";
import {Typography} from "antd";
import {openConsentBanner} from "../../model/consent-store";

interface IProps {
  style?: CSSProperties;
}

export default function CookieSettingsButton(props: IProps) {
  return (
    <Typography.Link role="button" onClick={openConsentBanner} style={props.style}>
      Налаштування cookie
    </Typography.Link>
  )
}
