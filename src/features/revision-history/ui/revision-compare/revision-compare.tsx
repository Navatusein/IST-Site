"use client"

import {useState} from "react";
import {Checkbox, Empty, Flex, Tag, theme, Typography} from "antd";
import {usePageComponentRegistry} from "@/entities/dynamic-page/model";
import {IRevisionComparison} from "@/shared/types/revision";
import formatDate from "@/shared/utilities/format-date";
import {BlockChangeStatus, compareBlocks, compareFields} from "../../utilities/compare-revisions";
import DiffText from "../diff-text/diff-text";

interface IProps {
  comparison: IRevisionComparison;
  fieldLabels: Record<string, string>;
}

const STATUS_TAGS: Record<BlockChangeStatus, {label: string, color: string}> = {
  added: {label: "Додано", color: "success"},
  changed: {label: "Змінено", color: "warning"},
  removed: {label: "Видалено", color: "error"},
};

export default function RevisionCompare(props: IProps) {
  const {token} = theme.useToken();
  const registry = usePageComponentRegistry();

  const [showAllFields, setShowAllFields] = useState<boolean>(false);

  const {revision, previous} = props.comparison;

  const fields = compareFields(previous?.data ?? null, revision.data, props.fieldLabels);
  const shownFields = previous && !showAllFields ? fields.filter((field) => field.isChanged) : fields;
  const blocks = previous ? compareBlocks(previous.data.entities, revision.data.entities) : [];

  const getBlockName = (componentType: string) => componentType == "group" ?
    "Розмітка" :
    registry.getDescriptor(componentType)?.name ?? componentType;

  const rowStyle = {
    padding: `${token.paddingXS}px ${token.paddingSM}px`,
    borderRadius: token.borderRadius,
    border: `1px solid ${token.colorBorderSecondary}`,
    background: token.colorBgContainer
  };

  return (
    <Flex vertical gap="small">
      <Typography.Text type="secondary">
        {previous ?
          `Порівняно з версією від ${formatDate(previous.createdAt, "D MMMM YYYY, HH:mm")}` :
          "Перша збережена версія: показано всі поля"}
      </Typography.Text>
      {fields.length != 0 && (
        <Flex vertical gap={4}>
          <Flex justify="space-between" align="center">
            <Typography.Text strong>Поля</Typography.Text>
            {previous && (
              <Checkbox checked={showAllFields} onChange={(event) => setShowAllFields(event.target.checked)}>
                Усі поля
              </Checkbox>
            )}
          </Flex>
          {shownFields.length == 0 ? (
            <Typography.Text type="secondary">Поля не змінювались</Typography.Text>
          ) : shownFields.map((field) => (
            <Flex key={field.field} vertical gap={2} style={rowStyle}>
              <Typography.Text type="secondary" style={{fontSize: 12}}>{field.label}</Typography.Text>
              {field.isChanged ? <DiffText before={field.before} after={field.after}/> : <span>{field.after || "—"}</span>}
            </Flex>
          ))}
        </Flex>
      )}
      {previous && "entities" in revision.data && (
        <Flex vertical gap={4}>
          <Typography.Text strong>Блоки</Typography.Text>
          {blocks.length == 0 ? (
            <Typography.Text type="secondary">Блоки не змінювались</Typography.Text>
          ) : blocks.map((block) => (
            <Flex key={block.id} vertical gap={2} style={rowStyle}>
              <Flex align="center" gap="small">
                <Tag color={STATUS_TAGS[block.status].color} style={{marginInlineEnd: 0}}>{STATUS_TAGS[block.status].label}</Tag>
                <Typography.Text strong>{getBlockName(block.componentType)}</Typography.Text>
                {block.groupId && <Typography.Text type="secondary" style={{fontSize: 12}}>у розмітці</Typography.Text>}
              </Flex>
              {block.beforeText != block.afterText ? (
                <DiffText before={block.beforeText} after={block.afterText}/>
              ) : block.status == "changed" && (
                <Typography.Text type="secondary" style={{fontSize: 12}}>Змінено налаштування або порядок вкладених блоків</Typography.Text>
              )}
            </Flex>
          ))}
        </Flex>
      )}
      {fields.length == 0 && !("entities" in revision.data) && <Empty image={Empty.PRESENTED_IMAGE_SIMPLE}/>}
    </Flex>
  )
}
