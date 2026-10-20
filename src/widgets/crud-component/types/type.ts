import {ReactNode} from "react";
import {IExportFile, IExportParams, IImportReport} from "@/shared/types/import-export";

export interface IAdditionalToolbarButton {
  key?: string;
  label: string;
  tooltip: string;
  icon: ReactNode;
  onClick: () => void;
  danger?: boolean;
  disabled?: boolean;
}

export interface IAdditionalMenuItem<T> {
  key: string;
  label: string;
  icon: ReactNode;
  onClick: (rows?: T[]) => void;
  danger?: boolean;
}

export type CrudDrawerMode = "create" | "copy" | "edit";

export interface ICrudImportExport {
  fileName: string;
  exportRecords: (params: IExportParams) => Promise<IExportFile>;
  importRecords: (file: unknown, apply: boolean) => Promise<IImportReport>;
}
