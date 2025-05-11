import {Flex, Spin} from "antd";

interface IProps {

}

export default function Loader(props: IProps) {
  return (
    <Flex style={{width: "100%", height: "100%"}} align="center" justify="center">
      <Spin/>
    </Flex>
  )
}
