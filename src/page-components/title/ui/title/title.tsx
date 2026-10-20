import {Typography} from "antd";
import {IPageComponentViewProps} from "@/entities/dynamic-page/model";
import {ITitlePageComponent} from "../../types/type";

export default function Title(props: IPageComponentViewProps<ITitlePageComponent>) {
  return (
    <Typography.Title level={props.component.level} style={{margin: 0}}>
      {props.component.title}
    </Typography.Title>
  )
}
