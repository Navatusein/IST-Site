"use client"

import {Result} from "antd";

export default function NotFound() {
  return (
    <Result
      status="404"
      title="404"
      subTitle="Такої сторінки не існує"
    />
  );
}
