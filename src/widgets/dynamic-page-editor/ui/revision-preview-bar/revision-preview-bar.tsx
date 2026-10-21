import {Button, Flex, theme, Typography} from "antd";
import {CloseOutlined, HistoryOutlined, RollbackOutlined} from "@ant-design/icons";
import formatDate from "@/shared/utilities/format-date";
import type {IBlockChange} from "@/features/revision-history";
import RevisionChangesSummary from "../revision-changes-summary/revision-changes-summary";

interface IProps {
  createdAt: string;
  authorName?: string;
  changes?: IBlockChange[];
  onRestore: () => void;
  onClose: () => void;
}

export default function RevisionPreviewBar(props: IProps) {
  const {token} = theme.useToken();

  return (
    <Flex
      align="center"
      gap="small"
      wrap
      style={{
        position: "sticky",
        top: 64 + token.paddingXS,
        zIndex: 10,
        margin: token.paddingSM,
        padding: `${token.paddingXS}px ${token.paddingXS}px ${token.paddingXS}px ${token.padding}px`,
        borderRadius: token.borderRadiusLG,
        border: `1px solid ${token.colorPrimaryBorder}`,
        background: token.colorPrimaryBg,
        boxShadow: token.boxShadowTertiary
      }}
    >
      <HistoryOutlined style={{color: token.colorPrimary}}/>
      <Typography.Text strong>Версія від {formatDate(props.createdAt, "D MMMM YYYY, HH:mm")}</Typography.Text>
      {props.authorName && <Typography.Text type="secondary">· {props.authorName}</Typography.Text>}
      {props.changes && <RevisionChangesSummary changes={props.changes}/>}
      <Flex gap="small" style={{marginLeft: "auto"}}>
        <Button type="primary" icon={<RollbackOutlined/>} onClick={props.onRestore}>Відновити блоки</Button>
        <Button icon={<CloseOutlined/>} onClick={props.onClose}>Закрити</Button>
      </Flex>
    </Flex>
  )
}
