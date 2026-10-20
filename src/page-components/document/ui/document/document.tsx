import {CSSProperties, ReactNode, useEffect, useState} from "react";
import {Alert, Button, Card, Empty, Flex, Typography} from "antd";
import {DownloadOutlined, ExpandOutlined} from "@ant-design/icons";
import {FileTypeIcon} from "@/entities/file/ui";
import {IPageComponentViewProps, usePageComponentData} from "@/entities/dynamic-page/model";
import type {PageLinkFiles} from "@/features/page-link";
import formatFileSize from "@/shared/utilities/format-file-size";
import {getFileAssetUrl, getFileDownloadUrl, getFileNamedAssetUrl, getFileViewUrl} from "@/shared/utilities/file-urls";
import {DocumentAspectRatio, IDocumentPageComponent} from "../../types/type";
import {DocumentKind, getDocumentKind} from "../../utilities/get-document-kind";

const ASPECT_RATIOS: Record<Exclude<DocumentAspectRatio, "auto">, string> = {
  "a4": "1 / 1.414",
  "16/9": "16 / 9",
  "4/3": "4 / 3",
};

const AUTO_ASPECT_RATIOS: Partial<Record<DocumentKind, Exclude<DocumentAspectRatio, "auto">>> = {
  pdf: "a4",
  office: "a4",
  presentation: "16/9",
  text: "a4",
};

const isPublicOrigin = (origin: string) => !/^https?:\/\/(localhost|127\.|10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)/.test(origin);

export default function DocumentView(props: IPageComponentViewProps<IDocumentPageComponent, PageLinkFiles>) {
  const files = usePageComponentData<PageLinkFiles>(props.component, props.data);

  const [origin, setOrigin] = useState<string | null>(null);
  useEffect(() => setOrigin(() => window.location.origin), []);
  const slug = props.component.fileSlug;
  const file = slug ? files?.[slug] : undefined;

  if (!slug)
    return <Empty description="Документ не вибрано" image={Empty.PRESENTED_IMAGE_SIMPLE}/>;

  if (!files)
    return null;

  if (!file)
    return <Alert type="warning" showIcon title="Файл документа не знайдено"/>;

  const kind = getDocumentKind(file.name);
  const assetUrl = getFileAssetUrl(slug);
  const ratio = props.component.aspectRatio == "auto" ? AUTO_ASPECT_RATIOS[kind] : props.component.aspectRatio;

  const frameStyle: CSSProperties = {
    display: "block",
    width: "100%",
    aspectRatio: ratio ? ASPECT_RATIOS[ratio] : undefined,
    maxHeight: "85vh",
    border: 0,
    borderRadius: 8,
  };

  const frame = (src: string) => (
    <iframe src={src} title={props.component.title || file.name} style={frameStyle} loading="lazy" allowFullScreen/>
  );

  let preview: ReactNode = null;

  if (kind == "pdf" || kind == "text")
    preview = frame(assetUrl);

  if ((kind == "office" || kind == "presentation") && origin) {
    preview = isPublicOrigin(origin) ?
      frame(`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(origin + getFileNamedAssetUrl(slug, file.name))}`) :
      <Alert type="info" showIcon title="Перегляд документів Office працює лише на опублікованому сайті"/>;
  }

  if (kind == "video")
    preview = <video src={assetUrl} controls preload="metadata" style={{...frameStyle, aspectRatio: ratio ? ASPECT_RATIOS[ratio] : "16 / 9", background: "#000"}}/>;

  if (kind == "audio")
    preview = <audio src={assetUrl} controls preload="metadata" style={{width: "100%"}}/>;

  if (kind == "image")
    preview = <img src={assetUrl} alt={props.component.title || file.name} style={{...frameStyle, objectFit: "contain"}}/>;

  const showFileBar = props.component.showFileBar || preview == null;

  return (
    <Flex vertical gap="small">
      {props.component.title && (
        <Typography.Title level={4} style={{margin: 0}}>{props.component.title}</Typography.Title>
      )}
      {preview}
      {showFileBar && (
        <Card variant="borderless" size="small">
          <Flex align="center" justify="space-between" gap="small" wrap>
            <Flex align="center" gap="small" style={{minWidth: 0, flex: "1 1 200px"}}>
              <span style={{fontSize: 24, lineHeight: 1}}><FileTypeIcon file={file}/></span>
              <Flex vertical style={{minWidth: 0}}>
                <Typography.Text strong ellipsis={{tooltip: file.name}}>{file.name}</Typography.Text>
                <Typography.Text type="secondary" style={{fontSize: 12}}>{formatFileSize(file.size)}</Typography.Text>
              </Flex>
            </Flex>
            <Flex gap="small" wrap>
              <Button icon={<ExpandOutlined/>} href={kind == "pdf" ? assetUrl : getFileViewUrl(slug)} target="_blank">
                Відкрити
              </Button>
              <Button type="primary" icon={<DownloadOutlined/>} href={getFileDownloadUrl(slug)}>
                Завантажити
              </Button>
            </Flex>
          </Flex>
        </Card>
      )}
    </Flex>
  )
}
