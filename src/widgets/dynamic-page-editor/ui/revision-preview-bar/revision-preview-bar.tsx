import {Button, Flex, Tag, theme, Typography} from "antd";
import {CloseOutlined, HistoryOutlined, RollbackOutlined} from "@ant-design/icons";
import formatDate from "@/shared/utilities/format-date";
import type {IBlockChange} from "@/features/revision-history";

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
      {props.changes && <ChangesSummary changes={props.changes}/>}
      <Flex gap="small" style={{marginLeft: "auto"}}>
        <Button type="primary" icon={<RollbackOutlined/>} onClick={props.onRestore}>Відновити блоки</Button>
        <Button icon={<CloseOutlined/>} onClick={props.onClose}>Закрити</Button>
      </Flex>
    </Flex>
  )
}

function ChangesSummary(props: {changes: IBlockChange[]}) {
  const count = (status: IBlockChange["status"]) => props.changes.filter((change) => change.status == status).length;

  if (props.changes.length == 0)
    return <Tag style={{marginInlineEnd: 0}}>Блоки не змінювались</Tag>;

  return (
    <Flex gap={4} wrap>
      {count("added") != 0 && <Tag color="success" style={{marginInlineEnd: 0}}>Додано: {count("added")}</Tag>}
      {count("changed") != 0 && <Tag color="warning" style={{marginInlineEnd: 0}}>Змінено: {count("changed")}</Tag>}
      {count("removed") != 0 && <Tag color="error" style={{marginInlineEnd: 0}}>Видалено: {count("removed")}</Tag>}
    </Flex>
  )
}
