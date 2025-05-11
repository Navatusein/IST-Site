import {Flex, theme} from "antd";
import {IDynamicPage} from "@/entities/dynamic-page";
import {PageComponentRenderer} from "@/widgets/page-component-renderer";

interface IProps {
  page: IDynamicPage
}

export default function DynamicPageRenderer(props: IProps) {
  const {token: {padding}} = theme.useToken();

  return (
    <Flex vertical gap="middle" style={{marginBottom: padding}}>
      {props.page.components.map((component, index) => (
        <PageComponentRenderer propsClass={component} key={`component-${index}`}/>
      ))}
    </Flex>
  )
}
