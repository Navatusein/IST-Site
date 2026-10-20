"use client"

import {
  FileExcelOutlined,
  FileImageOutlined,
  FileOutlined,
  FilePdfOutlined,
  FilePptOutlined,
  FileTextOutlined,
  FileWordOutlined,
  FileZipOutlined,
  VideoCameraOutlined
} from "@ant-design/icons";
import type {IFileEntry} from "../../types/type";

const ICONS_BY_EXTENSION: Record<string, typeof FileOutlined> = {
  ".doc": FileWordOutlined,
  ".docx": FileWordOutlined,
  ".xls": FileExcelOutlined,
  ".xlsx": FileExcelOutlined,
  ".ppt": FilePptOutlined,
  ".pptx": FilePptOutlined,
};

const ICONS_BY_TYPE: Partial<Record<IFileEntry["type"], typeof FileOutlined>> = {
  pdf: FilePdfOutlined,
  image: FileImageOutlined,
  text: FileTextOutlined,
  archive: FileZipOutlined,
  video: VideoCameraOutlined,
};

export default function FileTypeIcon(props: {file: IFileEntry}) {
  const Icon = ICONS_BY_EXTENSION[props.file.extension ?? ""] ?? ICONS_BY_TYPE[props.file.type] ?? FileOutlined;

  return <Icon/>;
}
