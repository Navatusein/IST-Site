import {RevisionCollection} from "./revision";

export interface ITrashItem {
  id: string;
  collection: RevisionCollection;
  recordId: string;
  recordName: string;
  deletedAt: string;
  deletedByName?: string;
  expiresAt: string;
}

export interface ITrashQuery {
  collections?: RevisionCollection[];
  search?: string;
  page: number;
  pageSize: number;
}

export interface ITrashPage {
  items: ITrashItem[];
  total: number;
  page: number;
  pageSize: number;
}
