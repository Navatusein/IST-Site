import {IDynamicPage} from "../../../../entities/dynamic-page";
import {PageComponentRenderer} from "@/widgets/page-component-renderer";

interface IProps {
  page: IDynamicPage
}

export default function DynamicPageView(props: IProps) {
  return (
    <>
      {props.page.components.map(component => (
        <PageComponentRenderer propsClass={component}/>
      ))}
    </>
  )
}