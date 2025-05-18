"use client"

import {theme} from "antd";


const typedComponentProps = {
  type: "hero-section-main",

}

export default function Component() {
  const {token: {}} = theme.useToken();


  return (
    <>
      test
    </>
  )
}