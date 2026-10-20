"use client"

import {createContext, Dispatch, SetStateAction} from "react";
import {IFileEntry} from "../../../types/type";

export interface IFileExplorerContext {
  currentFolder: string | null;
  setCurrentFolder: (value: string | null) => Promise<unknown>;

  selectedEntries: IFileEntry[];
  setSelectedEntries: Dispatch<SetStateAction<IFileEntry[]>>;

  updateFiles: number;
  setUpdateFiles: Dispatch<SetStateAction<number>>;
}

export const FileExplorerContext = createContext<IFileExplorerContext>({
  currentFolder: null,
  setCurrentFolder: () => Promise.resolve(),

  selectedEntries: [],
  setSelectedEntries: () => {},

  updateFiles: 0,
  setUpdateFiles: () => {}
});
