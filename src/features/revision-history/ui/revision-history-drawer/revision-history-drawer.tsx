"use client"

import {useEffect, useRef, useState} from "react";
import {App, Button, Drawer, Empty, Flex, Popconfirm, Skeleton, Tag, theme, Typography} from "antd";
import {DiffOutlined, EyeOutlined, RollbackOutlined, UpOutlined} from "@ant-design/icons";
import {IRevision, IRevisionComparison, IRevisionSummary, RevisionCollection} from "@/shared/types/revision";
import {unwrapServerAction} from "@/shared/utilities/unwrap-server-action";
import formatDate from "@/shared/utilities/format-date";
import {getRevisionAction, getRevisionComparisonAction, getRevisionsAction, restoreRevisionAction} from "../../actions/actions";
import RevisionCompare from "../revision-compare/revision-compare";
import {describeChanges} from "../../utilities/describe-changes";

interface IProps {
  collection: RevisionCollection;
  recordId: string | null;
  recordName?: string;
  onClose: () => void;
  fieldLabels: Record<string, string>;
  mode: "record" | "blocks";
  onRestored?: () => void;
  onPreviewBlocks?: (comparison: IRevisionComparison) => void;
  onRestoreBlocks?: (revision: IRevision) => void;
}

const DATE_FORMAT = "D MMMM YYYY, HH:mm";

export default function RevisionHistoryDrawer(props: IProps) {
  const {token} = theme.useToken();
  const {notification} = App.useApp();

  const [summaries, setSummaries] = useState<IRevisionSummary[] | null>(null);
  const [expanded, setExpanded] = useState<IRevisionComparison | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const requestId = useRef<number>(0);

  const load = () => {
    const currentRequestId = ++requestId.current;

    if (!props.recordId)
      return;

    setSummaries(null);

    unwrapServerAction(getRevisionsAction(props.collection, props.recordId))
      .then((result) => {
        if (currentRequestId == requestId.current)
          setSummaries(result);
      })
      .catch((error) => {
        if (currentRequestId != requestId.current)
          return;

        setSummaries([]);
        notification.error({title: "Не вдалося завантажити історію", description: error.message});
      });
  }

  useEffect(() => {
    setExpanded(null);
    load();
  }, [props.recordId]);

  const withRevision = async (summary: IRevisionSummary, action: (revision: IRevision) => void | Promise<void>) => {
    setBusyId(summary.id);

    try {
      const revision = await unwrapServerAction(getRevisionAction(props.collection, props.recordId, summary.id));

      if (!revision)
        throw new Error("Версію не знайдено");

      await action(revision);
    }
    catch (error) {
      notification.error({title: "Помилка", description: (error as Error).message});
    }
    finally {
      setBusyId(null);
    }
  }

  const withComparison = async (summary: IRevisionSummary, action: (comparison: IRevisionComparison) => void) => {
    setBusyId(summary.id);

    try {
      const comparison = await unwrapServerAction(getRevisionComparisonAction(props.collection, props.recordId, summary.id));

      if (!comparison)
        throw new Error("Версію не знайдено");

      action(comparison);
    }
    catch (error) {
      notification.error({title: "Помилка", description: (error as Error).message});
    }
    finally {
      setBusyId(null);
    }
  }

  const restore = (summary: IRevisionSummary) => withRevision(summary, async () => {
    await unwrapServerAction(restoreRevisionAction(props.collection, props.recordId, summary.id));
    notification.success({title: "Версію відновлено", description: "Попередній стан збережено в історії"});
    props.onRestored?.();
    load();
  });

  const getChanges = (summary: IRevisionSummary): string[] => {
    if (summary.isBaseline)
      return [];

    return describeChanges(summary.changedFields, summary.blocks, props.fieldLabels);
  }

  return (
    <Drawer
      open={props.recordId != null}
      onClose={props.onClose}
      title={props.recordName ? `Історія: ${props.recordName}` : "Історія змін"}
      size="large"
      destroyOnHidden
    >
      <Flex vertical gap="small">
        <Typography.Text type="secondary">
          Кожне збереження — окрема версія, зберігаються останні 30.
          {props.mode == "blocks" ?
            " Відновлені блоки з'являються в редакторі як незбережені зміни" :
            " Відновлення теж зберігається як версія, тож його можна скасувати"}
        </Typography.Text>
        {summaries == null ? <Skeleton active/> : summaries.length == 0 ? (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Історії ще немає: вона почнеться з наступного збереження"/>
        ) : summaries.map((summary) => {
          const changes = getChanges(summary);
          const isExpanded = expanded?.revision.id == summary.id;

          return (
            <Flex
              key={summary.id}
              vertical
              gap="small"
              style={{
                padding: `${token.paddingSM}px ${token.padding}px`,
                borderRadius: token.borderRadiusLG,
                border: `1px solid ${summary.isCurrent ? token.colorPrimaryBorder : token.colorBorderSecondary}`,
                background: summary.isCurrent ? token.colorPrimaryBg : token.colorBgContainer
              }}
            >
              <Flex align="center" gap="small" wrap>
                <Typography.Text strong>{formatDate(summary.createdAt, DATE_FORMAT)}</Typography.Text>
                {summary.isCurrent && <Tag color="processing" style={{marginInlineEnd: 0}}>Поточна</Tag>}
                {summary.isBaseline && <Tag style={{marginInlineEnd: 0}}>Початковий стан</Tag>}
                <Typography.Text type="secondary" style={{marginLeft: "auto"}}>
                  {summary.authorName ?? (summary.isBaseline ? "до початку історії" : "—")}
                </Typography.Text>
              </Flex>
              {changes.length != 0 && (
                <Flex gap={4} wrap>
                  {changes.map((change) => <Tag key={change} style={{marginInlineEnd: 0}}>{change}</Tag>)}
                </Flex>
              )}
              <Flex gap="small" wrap>
                {props.mode == "record" ? (
                  <Button
                    size="small"
                    icon={isExpanded ? <UpOutlined/> : <DiffOutlined/>}
                    loading={busyId == summary.id && !isExpanded}
                    onClick={() => isExpanded ? setExpanded(null) : withComparison(summary, setExpanded)}
                  >
                    {isExpanded ? "Сховати" : "Порівняти"}
                  </Button>
                ) : (
                  <Button
                    size="small"
                    icon={<EyeOutlined/>}
                    loading={busyId == summary.id}
                    onClick={() => withComparison(summary, (comparison) => props.onPreviewBlocks?.(comparison))}
                  >
                    Переглянути
                  </Button>
                )}
                {!summary.isCurrent && (props.mode == "record" ? (
                  <Popconfirm
                    title="Відновити цю версію?"
                    description="Поточний стан збережеться в історії"
                    okText="Відновити"
                    cancelText="Ні"
                    onConfirm={() => restore(summary)}
                  >
                    <Button size="small" icon={<RollbackOutlined/>}>Відновити</Button>
                  </Popconfirm>
                ) : (
                  <Button
                    size="small"
                    icon={<RollbackOutlined/>}
                    onClick={() => withRevision(summary, (revision) => props.onRestoreBlocks?.(revision))}
                  >
                    Відновити блоки
                  </Button>
                ))}
              </Flex>
              {isExpanded && expanded && <RevisionCompare comparison={expanded} fieldLabels={props.fieldLabels}/>}
            </Flex>
          );
        })}
      </Flex>
    </Drawer>
  )
}
