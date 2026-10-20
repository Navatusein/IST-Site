"use client"

import {CSSProperties, useEffect, useState} from "react";
import {Alert} from "antd";
import {getFileAssetUrl, getFileNamedAssetUrl} from "@/shared/utilities/file-urls";
import type {IFileEntry} from "../../types/type";
import {getFilePreviewKind} from "../../utilities/get-file-preview-kind";

interface IProps {
  file: IFileEntry;
  title?: string;
  style?: CSSProperties;
}

const isPublicOrigin = (origin: string) => !/^https?:\/\/(localhost|127\.|10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)/.test(origin);

export function hasFilePreview(fileName: string): boolean {
  return getFilePreviewKind(fileName) != "none";
}

export default function FilePreview(props: IProps) {
  const [origin, setOrigin] = useState<string | null>(null);
  useEffect(() => setOrigin(() => window.location.origin), []);

  const kind = getFilePreviewKind(props.file.name);
  const assetUrl = getFileAssetUrl(props.file.slug);
  const title = props.title || props.file.name;
  const style: CSSProperties = {display: "block", width: "100%", border: 0, ...props.style};

  switch (kind) {
    case "pdf":
    case "text":
      return <iframe src={assetUrl} title={title} style={style} loading="lazy" allowFullScreen/>;

    case "office":
    case "presentation":
      if (!origin)
        return null;

      if (!isPublicOrigin(origin))
        return <Alert type="info" showIcon title="Перегляд документів Office працює лише на опублікованому сайті"/>;

      return (
        <iframe
          src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(origin + getFileNamedAssetUrl(props.file.slug, props.file.name))}`}
          title={title}
          style={style}
          loading="lazy"
          allowFullScreen
        />
      );

    case "video":
      return <video src={assetUrl} controls preload="metadata" style={{background: "#000", ...style}}/>;

    case "audio":
      return <audio src={assetUrl} controls preload="metadata" style={{width: "100%"}}/>;

    case "image":
      return <img src={assetUrl} alt={title} style={{objectFit: "contain", ...style}}/>;

    default:
      return null;
  }
}
