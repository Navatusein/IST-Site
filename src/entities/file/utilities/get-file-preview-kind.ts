export type FilePreviewKind = "pdf" | "office" | "presentation" | "video" | "audio" | "image" | "text" | "none";

const KINDS: Record<string, FilePreviewKind> = {
  ".pdf": "pdf",
  ".doc": "office", ".docx": "office", ".odt": "office", ".rtf": "office",
  ".xls": "office", ".xlsx": "office", ".ods": "office",
  ".ppt": "presentation", ".pptx": "presentation", ".odp": "presentation",
  ".mp4": "video", ".webm": "video", ".mov": "video",
  ".mp3": "audio", ".wav": "audio", ".ogg": "audio", ".m4a": "audio",
  ".jpg": "image", ".jpeg": "image", ".png": "image", ".gif": "image", ".webp": "image", ".avif": "image", ".svg": "image",
  ".txt": "text", ".md": "text", ".csv": "text", ".log": "text", ".json": "text", ".xml": "text",
};

export function getFilePreviewKind(fileName: string): FilePreviewKind {
  const extension = fileName.slice(fileName.lastIndexOf(".")).toLowerCase();
  return KINDS[extension] ?? "none";
}
