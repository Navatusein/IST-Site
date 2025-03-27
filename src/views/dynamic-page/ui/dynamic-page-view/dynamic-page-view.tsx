import {ICustomPage} from "@/entities/custom-page";
import {PageComponentRenderer} from "@/widgets/page-component-renderer";

interface IProps {
  page: ICustomPage
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