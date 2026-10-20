import {createContext} from "react";
import type {IFileEntry} from "@/entities/file";

export interface IEntryNameModalContext {
  openCreateFolder: () => void;
  openRename: (entry: IFileEntry) => void;
}

export const EntryNameModalContext = createContext<IEntryNameModalContext>({
  openCreateFolder: () => {},
  openRename: () => {}
});
