"use client"

import {Fragment} from "react";
import {Alert, Typography} from "antd";
import {IPageEntity} from "@/entities/dynamic-page";
import {getPageMainHeadings, usePageComponentRegistry} from "@/entities/dynamic-page/model";
import type {IPageMainHeading} from "@/entities/dynamic-page/model";
import {scrollToPageEntity} from "@/entities/dynamic-page/utilities/page-entity-element-id";
import {usePageEditor} from "../../context/page-editor-context";
import {
  getMainHeadingIssue,
  getMainHeadingIssueHint,
  getMainHeadingIssueTitle,
  IPageMainHeadingSource
} from "../../model/main-heading-issue";

interface IProps {
  entities: IPageEntity[];
  mainHeading: IPageMainHeadingSource;
}

export default function MainHeadingBar(props: IProps) {
  const registry = usePageComponentRegistry();
  const editor = usePageEditor();

  const issue = getMainHeadingIssue(getPageMainHeadings(props.entities, registry), props.mainHeading);

  if (!issue)
    return null;

  const select = (heading: IPageMainHeading) => {
    scrollToPageEntity(heading.componentId);
    editor.select(heading.componentId);
  }

  const hint = getMainHeadingIssueHint(issue, props.mainHeading);

  return (
    <Alert
      type={issue.type == "missing" ? "info" : "warning"}
      showIcon
      style={{margin: "0 12px 12px"}}
      title={getMainHeadingIssueTitle(issue, props.mainHeading)}
      description={issue.type == "missing" ? hint : (
        <>
          {hint}:{" "}
          {issue.headings.map((heading, index) => (
            <Fragment key={`${heading.componentId}-${index}`}>
              {index != 0 && ", "}
              <Typography.Link onClick={() => select(heading)}>«{heading.text || "без тексту"}»</Typography.Link>
            </Fragment>
          ))}
        </>
      )}
    />
  );
}
