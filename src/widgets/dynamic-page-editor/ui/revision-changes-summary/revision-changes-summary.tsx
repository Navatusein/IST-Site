import {Flex, Tag} from "antd";
import type {IBlockChange} from "@/features/revision-history";

export default function RevisionChangesSummary(props: {changes: IBlockChange[]}) {
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
