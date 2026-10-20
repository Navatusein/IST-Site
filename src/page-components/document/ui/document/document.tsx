import {CSSProperties} from "react";
import {Alert, Empty, Flex, Typography} from "antd";
import {FileBar, FilePreview, hasFilePreview} from "@/entities/file/ui";
import {FilePreviewKind, getFilePreviewKind} from "@/entities/file/utilities/get-file-preview-kind";
import {IPageComponentViewProps, usePageComponentData} from "@/entities/dynamic-page/model";
import type {PageLinkFiles} from "@/features/page-link";
import {DocumentAspectRatio, IDocumentPageComponent} from "../../types/type";

const ASPECT_RATIOS: Record<Exclude<DocumentAspectRatio, "auto">, string> = {
  "a4": "1 / 1.414",
  "16/9": "16 / 9",
  "4/3": "4 / 3",
};

const AUTO_ASPECT_RATIOS: Partial<Record<FilePreviewKind, Exclude<DocumentAspectRatio, "auto">>> = {
  pdf: "a4",
  office: "a4",
  presentation: "16/9",
  text: "a4",
  video: "16/9",
};

export default function DocumentView(props: IPageComponentViewProps<IDocumentPageComponent, PageLinkFiles>) {
  const files = usePageComponentData<PageLinkFiles>(props.component, props.data);
  const slug = props.component.fileSlug;
  const file = slug ? files?.[slug] : undefined;

  if (!slug)
    return <Empty description="Документ не вибрано" image={Empty.PRESENTED_IMAGE_SIMPLE}/>;

  if (!files)
    return null;

  if (!file)
    return <Alert type="warning" showIcon title="Файл документа не знайдено"/>;

  const ratio = props.component.aspectRatio == "auto" ? AUTO_ASPECT_RATIOS[getFilePreviewKind(file.name)] : props.component.aspectRatio;

  const previewStyle: CSSProperties = {
    aspectRatio: ratio ? ASPECT_RATIOS[ratio] : undefined,
    maxHeight: "85vh",
    borderRadius: 8,
  };

  const hasPreview = hasFilePreview(file.name);

  return (
    <Flex vertical gap="small">
      {props.component.title && (
        <Typography.Title level={4} style={{margin: 0}}>{props.component.title}</Typography.Title>
      )}
      {hasPreview && <FilePreview file={file} title={props.component.title} style={previewStyle}/>}
      {(props.component.showFileBar || !hasPreview) && <FileBar file={file} showOpen/>}
    </Flex>
  )
}
