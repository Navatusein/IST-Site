import {CSSProperties} from "react";
import {Alert, Empty, Flex, theme} from "antd";
import {IBasePageComponent, IPageComponentGroup, IPageEntity} from "@/entities/dynamic-page";
import {PageComponentRenderer, PageGroupRenderer} from "@/entities/dynamic-page/ui";
import {getPageEntityElementId} from "@/entities/dynamic-page/utilities/page-entity-element-id";

interface IProps {
  entities: IPageEntity[];
  highlights?: Map<string, "added" | "changed">;
}

export default function PagePreview(props: IProps) {
  const {token} = theme.useToken();
  const {padding} = token;

  const getHighlightStyle = (id: string): CSSProperties | undefined => {
    const status = props.highlights?.get(id);

    if (!status)
      return undefined;

    return {
      outline: `2px dashed ${status == "added" ? token.colorSuccess : token.colorWarning}`,
      outlineOffset: 4,
      borderRadius: token.borderRadiusLG
    };
  }

  if (props.entities.length == 0)
    return <Empty description="Сторінка порожня" style={{margin: padding}}/>;

  return (
    <Flex vertical gap="middle" style={{marginBottom: padding}}>
      {props.entities.map((entity, index) => (
        <div key={entity.id} id={getPageEntityElementId(entity.id)} style={{scrollMarginTop: 80, ...getHighlightStyle(entity.id)}}>
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
