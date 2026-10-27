"use client"

import {Card, Flex, theme, Typography} from "antd";
import {useSnippetSite} from "../../hooks/use-snippet-site";

const TITLE_LIMIT = 60;
const DESCRIPTION_LIMIT = 160;

interface IProps {
  title?: string;
  description?: string;
  path: string;
  // Shown when the description is empty
  descriptionFallback?: string;
}

function truncate(text: string, limit: number): string {
  return text.length > limit ? text.slice(0, limit - 1).trimEnd() + "…" : text;
}

export default function SearchSnippetPreview(props: IProps) {
  const {token} = theme.useToken();
  const site = useSnippetSite();

  const title = props.title?.trim() || "Без заголовка";
  const fullTitle = site?.shortName && !title.includes(site.shortName) ? `${title} — ${site.shortName}` : title;
  const description = props.description?.trim().replace(/\s+/g, " ") ?? "";
  const url = `${site?.origin.replace(/^https?:\/\//, "") ?? ""}${props.path}`.split("/").filter(Boolean).join(" › ");

  return (
    <Flex vertical gap={4}>
      <Typography.Text type="secondary" style={{fontSize: token.fontSizeSM}}>Так сторінка може виглядати в пошуку Google</Typography.Text>
      <Card size="small">
        <Flex vertical gap={2} style={{minWidth: 0}}>
          <Typography.Text type="secondary" ellipsis style={{fontSize: token.fontSizeSM}}>{url}</Typography.Text>
          <Typography.Text style={{color: token.colorLink, fontSize: token.fontSizeLG}} ellipsis>{truncate(fullTitle, TITLE_LIMIT)}</Typography.Text>
          {description ?
            <Typography.Text type="secondary">{truncate(description, DESCRIPTION_LIMIT)}</Typography.Text> :
            <Typography.Text type="secondary" italic>{props.descriptionFallback ?? "Опис не вказано, Google підбере текст зі сторінки сам"}</Typography.Text>}
        </Flex>
      </Card>
      {fullTitle.length > TITLE_LIMIT && (
        <Typography.Text type="warning" style={{fontSize: token.fontSizeSM}}>
          Заголовок у пошуку довший за {TITLE_LIMIT} символів ({fullTitle.length}), Google обріже його
        </Typography.Text>
      )}
      {description.length > DESCRIPTION_LIMIT && (
        <Typography.Text type="warning" style={{fontSize: token.fontSizeSM}}>
          Опис довший за {DESCRIPTION_LIMIT} символів ({description.length}), у пошуку буде видно лише початок
        </Typography.Text>
      )}
    </Flex>
  )
}
