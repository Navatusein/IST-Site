import {Flex, Spin} from "antd";

interface IProps {
  fullScreen?: boolean;
}

export default function Loader(props: IProps) {
  if (props.fullScreen)
    return (
      <Flex
        justify="center"
        align="center"
        style={{position: "fixed", inset: 0, pointerEvents: "none"}}
      >
        <Spin size="large"/>
      </Flex>
    );

  return (
    <Flex justify="center" align="center" style={{width: "100%", minHeight: 200, flexGrow: 1}}>
      <Spin/>
    </Flex>
  )
}
