import {useMemo} from "react";
import {IBasePageComponent} from "@/entities/dynamic-page";
import {PageComponentError} from "@/shared/ui-kit";
import TitleEditor from "../title-editor/title-editor";
import {ITitlePageComponent} from "../../types/type";
import {Typography} from "antd";

interface IProps {
  component: IBasePageComponent;
}

export default function Title(props: IProps) {
  const typedComponent = useMemo(() => {
    if (props.component.componentType !== "title")
      return null;

    return props.component as ITitlePageComponent;
  }, [props]);

  return (
    <PageComponentError component={typedComponent}>
      <Typography.Title level={typedComponent!.level} style={{margin: 0}}>
        {typedComponent!.title}
      </Typography.Title>
    </PageComponentError>
  )
}

Title.Editor = TitleEditor