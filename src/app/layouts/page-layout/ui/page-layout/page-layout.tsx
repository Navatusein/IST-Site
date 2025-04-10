import {Layout} from "antd";
import {ReactNode} from "react";

interface IProps {
  children: ReactNode;
}

export default function PageLayout(props: IProps) {
  return (
    <Layout style={{padding: "8px", overflow: "hidden"}}>
      {props.children}
    </Layout>
  )
}
