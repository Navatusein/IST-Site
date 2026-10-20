import {Metadata} from "next";
import {Flex, Result} from "antd";

export const metadata: Metadata = {title: "Сторінку не знайдено"};

export default function Page() {
  return (
    <Flex vertical style={{height: "calc(100svh - 60px)"}} justify="center">
      <Result
        status="404"
        title="404"
        subTitle="Такої сторінки не існує"
      />
    </Flex>
  )
}