export type RevisionCollection = "dynamic-pages" | "news" | "department-staff" | "department-aspirants" | "public-menu";

export interface IRevisionAuthor {
  id: string;
  name: string;
}

export interface IRevisionBlocksChange {
  added: number;
  removed: number;
  changed: number;
  moved: boolean;
}

export interface IRevisionSummary {
  id: string;
  createdAt: string;
  authorName?: string;
  isBaseline: boolean;
  isCurrent: boolean;
  changedFields: string[];
  blocks?: IRevisionBlocksChange;
}

export interface IRevision {
  id: string;
  createdAt: string;
  authorName?: string;
  data: Record<string, unknown>;
}

export interface IRevisionComparison {
  revision: IRevision;
  previous: IRevision | null;
}

export interface IRevisionLogQuery {
  collections?: RevisionCollection[];
  authorId?: string;
  from?: string;
  to?: string;
  search?: string;
  page: number;
  pageSize: number;
}

export interface IRevisionLogItem {
  id: string;
  collection: RevisionCollection;
  recordId: string;
  recordName: string;
  createdAt: string;
  authorName?: string;
  isCreated: boolean;
  isDeleted: boolean;
  changedFields: string[];
  blocks?: IRevisionBlocksChange;
}

export interface IRevisionLog {
  items: IRevisionLogItem[];
  total: number;
  page: number;
  pageSize: number;
  authors: IRevisionAuthor[];
}
