import {Flex, Result} from "antd";

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