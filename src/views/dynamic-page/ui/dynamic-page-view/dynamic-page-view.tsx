import {PageComponentRenderer} from "@/widgets/page-component-renderer";
import {IDynamicPage} from "@/entities/dynamic-page";

interface IProps {
  page: IDynamicPage
}

export default function DynamicPageView(props: IProps) {
  console.log(props.page)

  return (
    <>
      {props.page.components.map(component => (
        <PageComponentRenderer propsClass={component}/>
      ))}
    </>
  )
}