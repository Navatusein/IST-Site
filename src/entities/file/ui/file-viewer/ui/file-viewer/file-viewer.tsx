"use client"

import {CSSProperties, ReactNode} from "react";
import {Flex, Result} from "antd";
import type {IFileEntry} from "../../../../types/type";
import FileBar from "../../../file-bar/file-bar";
import FilePreview, {hasFilePreview} from "../../../file-preview/file-preview";

interface IProps {
  file: IFileEntry | null;
  style?: CSSProperties;
  barExtra?: ReactNode;
}

export default function FileViewer(props: IProps) {
  if (!props.file)
    return <Result status="404" title="Файл не знайдено" subTitle="Його могли видалити або перемістити"/>;

  return (
    <Flex vertical gap="small" style={{height: "100%", minHeight: 0, ...props.style}}>
      <FileBar file={props.file} extra={props.barExtra}/>
      <Flex vertical justify="center" style={{flex: 1, minHeight: 0}}>
        {hasFilePreview(props.file.name) ? (
          <FilePreview file={props.file} style={{height: "100%", maxHeight: "100%", borderRadius: 8}}/>
        ) : (
          <Result status="info" title="Попередній перегляд недоступний" subTitle="Завантажте файл, щоб відкрити його"/>
        )}
      </Flex>
    </Flex>
  )
}
