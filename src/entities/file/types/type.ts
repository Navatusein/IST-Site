export type FileEntryKind = "directory" | "file";

export type IFileTypes = "directory" | "file" | "image" | "pdf" | "text" | "back" | "archive" | "video";

export interface IFileEntryDocument {
  slug: string;
  name: string;
  kind: FileEntryKind;
  parentSlug: string | null;
  storageName?: string;
  mimeType?: string;
  size?: number;
  legacyPath?: string;
}

export interface IFileEntry {
  slug: string;
  name: string;
  kind: FileEntryKind;
  type: IFileTypes;
  parentSlug: string | null;
  size: number;
  extension?: string;
}

export interface IFolderBreadcrumb {
  slug: string | null;
  name: string;
}

export interface IFolder {
  breadcrumbs: IFolderBreadcrumb[];
  entries: IFileEntry[];
}
