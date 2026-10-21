import {createContext, useContext} from "react";
import invariant from "tiny-invariant";

export type UploadStatus = "waiting" | "uploading" | "done" | "error" | "cancelled";

export interface IUploadItem {
  id: string;
  file: File;
  folder: string | null;
  loaded: number;
  status: UploadStatus;
  error?: string;
}

export interface IUploadsContext {
  items: IUploadItem[];
  isUploading: boolean;
  upload: (files: File[]) => void;
  cancel: (id: string) => void;
  cancelAll: () => void;
  clear: () => void;
}

export const UploadsContext = createContext<IUploadsContext | null>(null);

export function useUploads(): IUploadsContext {
  const context = useContext(UploadsContext);
  invariant(context, "useUploads must be used inside UploadsContext");
  return context;
}
