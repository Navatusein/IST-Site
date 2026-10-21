"use client"

import {useEffect, useState} from "react";
import {Skeleton, Typography} from "antd";
import {IRevisionComparison, IRevisionLogItem} from "@/shared/types/revision";
import {unwrapServerAction} from "@/shared/utilities/unwrap-server-action";
import {getRevisionComparisonAction} from "../../actions/actions";
import {REVISION_TABLES} from "../../model/revision-tables";
import RevisionCompare from "../revision-compare/revision-compare";

export default function LogItemCompare(props: {item: IRevisionLogItem}) {
  const [comparison, setComparison] = useState<IRevisionComparison | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isCancelled = false;

    unwrapServerAction(getRevisionComparisonAction(props.item.collection, props.item.recordId, props.item.id))
      .then((result) => {
        if (!isCancelled)
          result ? setComparison(result) : setError("Версію не знайдено");
      })
      .catch((reason) => {
        if (!isCancelled)
          setError(reason.message);
      });

    return () => {
      isCancelled = true;
    }
  }, [props.item.id]);

  if (error)
    return <Typography.Text type="danger">{error}</Typography.Text>;

  if (!comparison)
    return <Skeleton active paragraph={{rows: 2}}/>;

  return <RevisionCompare comparison={comparison} fieldLabels={REVISION_TABLES[props.item.collection].fieldLabels}/>;
}
