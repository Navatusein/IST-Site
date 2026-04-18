import {Flex, Spin} from "antd";

interface IProps {

}

export default function Loader(props: IProps) {
  return (
    <Flex justify="center" align="center" style={{width: "100%", height: "100%", flexGrow: 1}}>
      <Spin/>
    </Flex>
  )
}
