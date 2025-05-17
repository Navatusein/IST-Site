import {useMemo} from "react";
import {IBasePageComponent} from "@/entities/dynamic-page";
import {PageComponentError} from "@/shared/ui-kit";
import TitleEditor from "../title-editor/title-editor";
import {ITitlePageComponent} from "../../types/type";
import {Typography} from "antd";

interface IProps {
  componentProps: IBasePageComponent;
}

export default function Title(props: IProps) {
  const typedComponentProps = useMemo(() => {
    if (props.componentProps.type !== "title")
      return null;

    return props.componentProps as ITitlePageComponent;
  }, [props]);

  return (
    <PageComponentError message={typedComponentProps == null ? "Fail" : ""}>
      <Typography.Title level={typedComponentProps!.level} style={{margin: 0}}>
        {typedComponentProps!.title}
      </Typography.Title>
    </PageComponentError>
  )
}

Title.Editor = TitleEditor