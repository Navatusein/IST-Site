export type DocumentKind = "pdf" | "office" | "presentation" | "video" | "audio" | "image" | "text" | "none";

const KINDS: Record<string, DocumentKind> = {
  ".pdf": "pdf",
  ".doc": "office", ".docx": "office", ".odt": "office", ".rtf": "office",
  ".xls": "office", ".xlsx": "office", ".ods": "office",
  ".ppt": "presentation", ".pptx": "presentation", ".odp": "presentation",
  ".mp4": "video", ".webm": "video", ".mov": "video",
  ".mp3": "audio", ".wav": "audio", ".ogg": "audio", ".m4a": "audio",
  ".jpg": "image", ".jpeg": "image", ".png": "image", ".gif": "image", ".webp": "image", ".avif": "image", ".svg": "image",
  ".txt": "text", ".md": "text", ".csv": "text", ".log": "text",
};

export function getDocumentKind(fileName: string): DocumentKind {
  const extension = fileName.slice(fileName.lastIndexOf(".")).toLowerCase();
  return KINDS[extension] ?? "none";
}
