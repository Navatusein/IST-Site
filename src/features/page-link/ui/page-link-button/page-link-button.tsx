"use client"

import {CSSProperties, MouseEvent, ReactNode} from "react";
import {Button, ButtonProps} from "antd";
import {ExportOutlined} from "@ant-design/icons";
import {useRouter} from "next/navigation";
import type {IFileEntry} from "@/entities/file";
import {FileTypeIcon} from "@/entities/file/ui";
import formatFileSize from "@/shared/utilities/format-file-size";
import {IPageLink} from "../../types/type";
import {getPageLinkHref, isExternalPageLink} from "../../utilities/page-link";

interface IProps {
  link: IPageLink;
  file?: IFileEntry;
  showFileSize?: boolean;
  type?: ButtonProps["type"];
  block?: boolean;
  style?: CSSProperties;
  children: ReactNode;
}

export default function PageLinkButton(props: IProps) {
  const router = useRouter();

  if (!props.link.link)
    return (
      <Button type={props.type} block={props.block} style={props.style} disabled>
        {props.children}
      </Button>
    );

  const href = getPageLinkHref(props.link);
  const isExternal = isExternalPageLink(props.link);

  const navigate = (event: MouseEvent) => {
    if (event.button != 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
      return;

    event.preventDefault();
    router.push(href);
  }

  return (
    <Button
      type={props.type}
      href={href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      onClick={isExternal ? undefined : navigate}
      icon={props.file ? <FileTypeIcon file={props.file}/> : undefined}
      block={props.block}
      style={props.style}
    >
      {props.children}
      {props.file && props.showFileSize && <span style={{opacity: 0.7}}>({formatFileSize(props.file.size)})</span>}
      {isExternal && <ExportOutlined style={{fontSize: "0.85em"}}/>}
    </Button>
  )
}
