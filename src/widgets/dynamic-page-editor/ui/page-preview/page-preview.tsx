import {Alert, Empty, Flex, theme} from "antd";
import {IBasePageComponent, IPageComponentGroup, IPageEntity} from "@/entities/dynamic-page";
import {PageComponentRenderer, PageGroupRenderer} from "@/entities/dynamic-page/ui";
import {getPageEntityElementId} from "@/entities/dynamic-page/utilities/page-entity-element-id";

interface IProps {
  entities: IPageEntity[];
}

// The page as the public site renders it; ids keep the outline navigation working
export default function PagePreview(props: IProps) {
  const {token: {padding}} = theme.useToken();

  if (props.entities.length == 0)
    return <Empty description="Сторінка порожня" style={{margin: padding}}/>;

  return (
    <Flex vertical gap="middle" style={{marginBottom: padding}}>
      {props.entities.map((entity, index) => (
        <div key={entity.id} id={getPageEntityElementId(entity.id)} style={{scrollMarginTop: 80}}>
          {entity.type == "component" ? (
            <PageComponentRenderer component={entity as IBasePageComponent}/>
          ) : entity.type == "group" ? (
            <PageGroupRenderer group={entity as IPageComponentGroup}/>
          ) : (
            <Alert type="error" title="Unknown page entity"/>
          )}
        </div>
      ))}
    </Flex>
  )
}
