"use client"

import {Button, Flex, Tag, theme, Tooltip, Typography} from "antd";
import {EditOutlined, ExportOutlined} from "@ant-design/icons";
import {ISiteLinkNode} from "../../types/type";
import {getSiteLinkEditUrl} from "../../utilities/site-links-graph";
import {SITE_LINK_KIND_LABELS, SITE_LINK_KIND_TAG_COLORS} from "../../utilities/site-link-kinds";

interface IProps {
  node?: ISiteLinkNode;
  details?: string;
  isBroken?: boolean;
  danger?: boolean;
  editNode?: ISiteLinkNode;
  componentId?: string;
}

export default function SiteLinkRow(props: IProps) {
  const {token} = theme.useToken();

  const kind = props.isBroken ? "broken" : props.node?.kind;
  const isDanger = props.isBroken || props.danger;
  const editNode = props.editNode ?? props.node;
  const editTooltip = editNode?.kind == "menu" ? "Редагувати пункт меню" :
    props.componentId ? "Відкрити блок з посиланням у редакторі" : "Редагувати контент";

  return (
    <Flex
      align="center"
      gap="small"
      style={{
        padding: `${token.paddingXS}px ${token.paddingSM}px`,
        borderRadius: token.borderRadiusLG,
        border: `1px solid ${isDanger ? token.colorErrorBorder : token.colorBorderSecondary}`,
        background: isDanger ? token.colorErrorBg : token.colorBgContainer
      }}
    >
      {kind && (
        <Tag
          color={SITE_LINK_KIND_TAG_COLORS[kind]}
          style={{marginInlineEnd: 0, flexShrink: 0, ...(kind == "broken" && {background: token.colorBgContainer})}}
        >
          {SITE_LINK_KIND_LABELS[kind]}
        </Tag>
      )}
      <Flex vertical gap={2} style={{flex: 1, minWidth: 0}}>
        {props.node && <Typography.Text strong ellipsis>{props.node.title}</Typography.Text>}
        {props.details && (
          <Typography.Text type={isDanger ? "danger" : "secondary"} ellipsis style={{fontSize: 12}}>
            {props.details}
          </Typography.Text>
        )}
      </Flex>
      {props.node?.path && (
        <Tooltip title="Відкрити на сайті">
          <Button type="text" size="small" icon={<ExportOutlined/>} href={props.node.path} target="_blank" aria-label="Відкрити на сайті"/>
        </Tooltip>
      )}
      {editNode && (
        <Tooltip title={editTooltip}>
          <Button type="text" size="small" icon={<EditOutlined/>} href={getSiteLinkEditUrl(editNode, props.componentId)} aria-label={editTooltip}/>
        </Tooltip>
      )}
    </Flex>
  )
}
