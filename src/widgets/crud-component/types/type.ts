import {ReactNode} from "react";
import {IExportFile, IExportParams, IImportReport} from "@/shared/types/import-export";

export interface ICrudRowAction<T> {
  key: string;
  label: string;
  icon: ReactNode;
  onClick: (record: T) => void;
  primary?: boolean;
  danger?: boolean;
}

export interface ICrudPageAction {
  key: string;
  label: string;
  icon: ReactNode;
  onClick: () => void;
  danger?: boolean;
}

export type CrudDrawerMode = "create" | "copy" | "edit";

export interface ICrudImportExport {
  fileName: string;
  exportRecords: (params: IExportParams) => Promise<IExportFile>;
  importRecords: (file: unknown, apply: boolean) => Promise<IImportReport>;
}
