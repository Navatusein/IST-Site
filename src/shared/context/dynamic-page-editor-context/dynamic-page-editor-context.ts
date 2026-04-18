import {createContext, Dispatch, Key, SetStateAction} from "react";

export interface IFileExplorerContext {
  currentPath: string;
  setCurrentPath: (value: string) => Promise<any>;

  selectedRowKeys: Key[];
  setSelectedRowKeys: Dispatch<SetStateAction<Key[]>>;

  updateFiles: number;
  setUpdateFiles: Dispatch<SetStateAction<number>>
}

export const DynamicPageEditorContext = createContext<IFileExplorerContext>({
  currentPath: "string",
  setCurrentPath: () => Promise.resolve(""),

  selectedRowKeys: [],
  setSelectedRowKeys: () => {},

  updateFiles: 0,
  setUpdateFiles: () => {}
});