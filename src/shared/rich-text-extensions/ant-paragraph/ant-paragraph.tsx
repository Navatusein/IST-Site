import {CSSProperties, ReactNode} from "react";
import {Typography} from "antd";
import styles from "./ant-paragraph.module.scss";

interface IProps {
  textAlign?: CSSProperties["textAlign"] | null;
  children?: ReactNode;
}

export default function AntParagraph(props: IProps) {
  return (
    <Typography.Paragraph className={styles.paragraph} style={{textAlign: props.textAlign ?? "left"}}>
      {props.children}
    </Typography.Paragraph>
  )
}
