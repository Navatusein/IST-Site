export const EXPORT_FORMAT = "ist-site-export";
export const EXPORT_VERSION = 1;

export interface IExportFile<T = unknown> {
  format: typeof EXPORT_FORMAT;
  version: number;
  entity: string;
  exportedAt: string;
  items: T[];
}

export interface IExportParams {
  ids?: string[];
  search?: string;
}

export interface IImportRowError {
  row: number;
  name?: string;
  message: string;
}

export interface IImportReport {
  applied: boolean;
  total: number;
  created: number;
  updated: number;
  errors: IImportRowError[];
  warnings: string[];
}

export const MAX_IMPORT_ITEMS = 2000;
