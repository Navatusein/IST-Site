"use client"

import {Result} from "antd";

export default function Page() {
  return (
    <Result
      status="403"
      title="Доступ заборонено"
      subTitle="У вас недостатньо прав для перегляду цієї сторінки."
    />
  );
}
