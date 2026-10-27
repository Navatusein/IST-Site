"use client"

import {ReactNode} from "react";
import {Button, Card, Flex, Typography} from "antd";
import {DownloadOutlined, ExpandOutlined} from "@ant-design/icons";
import formatFileSize from "@/shared/utilities/format-file-size";
import {getFileDownloadUrl, getFileNamedAssetUrl, getFileViewUrl} from "@/shared/utilities/file-urls";
import type {IFileEntry} from "../../types/type";
import {getFilePreviewKind} from "../../utilities/get-file-preview-kind";
import FileTypeIcon from "../file-type-icon/file-type-icon";

interface IProps {
  file: IFileEntry;
  showOpen?: boolean;
  extra?: ReactNode;
}

export default function FileBar(props: IProps) {
  const {file} = props;

  return (
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
          {props.showOpen && (
            <Button
              icon={<ExpandOutlined/>}
              href={getFilePreviewKind(file.name) == "pdf" ? getFileNamedAssetUrl(file.slug, file.name) : getFileViewUrl(file.slug)}
              target="_blank"
            >
              Відкрити
            </Button>
          )}
          <Button type="primary" icon={<DownloadOutlined/>} href={getFileDownloadUrl(file.slug)}>
            Завантажити
          </Button>
          {props.extra}
        </Flex>
      </Flex>
    </Card>
  )
}
