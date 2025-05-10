import {Spin} from "antd";
import dynamic from "next/dynamic";
import {useMemo} from "react";

interface IProps {
  name: string;
}

export default function DynamicIcon(props: IProps) {
  const {name, ...iconProps} = props;

  const Icon = useMemo(() => {
    return dynamic(() => import(`@ant-design/icons/es/icons/${props.name}`).catch(() => () => null), {
      loading: () => <Spin size="small"/>,
    });
  }, [name]);

  return <Icon {...iconProps}/>;
}
