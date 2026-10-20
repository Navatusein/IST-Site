"use client"

import {
  FileExcelOutlined,
  FileGifOutlined,
  FileImageOutlined,
  FileJpgOutlined,
  FileMarkdownOutlined,
  FileOutlined,
  FilePdfOutlined,
  FilePptOutlined,
  FileTextOutlined,
  FileWordOutlined,
  FileZipOutlined,
  SoundOutlined,
  VideoCameraOutlined
} from "@ant-design/icons";
import type {IFileEntry} from "../../types/type";

interface IFileKind {
  icon: typeof FileOutlined;
  label: string;
  color?: string;
}

const WORD: IFileKind = {icon: FileWordOutlined, label: "Word", color: "#2b579a"};
const EXCEL: IFileKind = {icon: FileExcelOutlined, label: "Excel", color: "#217346"};
const POWERPOINT: IFileKind = {icon: FilePptOutlined, label: "PowerPoint", color: "#d24726"};
const AUDIO: IFileKind = {icon: SoundOutlined, label: "Аудіо", color: "#722ed1"};

const IMAGE_COLOR = "#d4b106";
const image = (label: string, icon: typeof FileOutlined = FileImageOutlined): IFileKind => ({icon, label, color: IMAGE_COLOR});

const TEXT: IFileKind = {icon: FileTextOutlined, label: "Текст", color: "#8c8c8c"};

const KINDS_BY_EXTENSION: Record<string, IFileKind> = {
  ".doc": WORD, ".docx": WORD, ".odt": WORD, ".rtf": WORD,
  ".xls": EXCEL, ".xlsx": EXCEL, ".ods": EXCEL, ".csv": EXCEL,
  ".ppt": POWERPOINT, ".pptx": POWERPOINT, ".odp": POWERPOINT,
  ".mp3": AUDIO, ".wav": AUDIO, ".ogg": AUDIO, ".m4a": AUDIO, ".flac": AUDIO,
  ".jpg": image("JPEG", FileJpgOutlined), ".jpeg": image("JPEG", FileJpgOutlined), ".gif": image("GIF", FileGifOutlined),
  ".png": image("PNG"), ".svg": image("SVG"), ".webp": image("WebP"), ".avif": image("AVIF"), ".bmp": image("BMP"),
  ".txt": TEXT, ".log": {...TEXT, label: "Журнал"},
  ".md": {icon: FileMarkdownOutlined, label: "Markdown", color: "#2f54eb"},
  ".json": {icon: FileTextOutlined, label: "JSON", color: "#08979c"},
  ".xml": {icon: FileTextOutlined, label: "XML", color: "#9254de"},
};

const KINDS_BY_TYPE: Partial<Record<IFileEntry["type"], IFileKind>> = {
  pdf: {icon: FilePdfOutlined, label: "PDF", color: "#e5252a"},
  image: image("Малюнок"),
  text: TEXT,
  archive: {icon: FileZipOutlined, label: "Архів", color: "#ad4e00"},
  video: {icon: VideoCameraOutlined, label: "Відео", color: "#eb2f96"},
};

const DEFAULT_KIND: IFileKind = {icon: FileOutlined, label: "Файл", color: "#8c8c8c"};

function getFileKind(file: IFileEntry): IFileKind {
  return KINDS_BY_EXTENSION[file.extension?.toLowerCase() ?? ""] ?? KINDS_BY_TYPE[file.type] ?? DEFAULT_KIND;
}

export function getFileTypeLabel(file: IFileEntry): string {
  return getFileKind(file).label;
}

export default function FileTypeIcon(props: {file: IFileEntry}) {
  const {icon: Icon, color} = getFileKind(props.file);

  return <Icon style={color ? {color} : undefined}/>;
}
