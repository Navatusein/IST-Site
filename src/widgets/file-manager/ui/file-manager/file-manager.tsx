"use client"

import {Space} from "antd";
import {useState} from "react";
import {useQueryState} from "nuqs";
import {IFileEntry} from "@/entities/file";
import {FileExplorerContext} from "@/entities/file/ui";
import FileManagerToolbar from "../file-manager-toolbar/file-manager-toolbar";
import ClipboardBar from "../clipboard-bar/clipboard-bar";
import FileDropZone from "../file-drop-zone/file-drop-zone";
import {EntryNameModalContext} from "../../context/entry-name-modal-context";
import EntryNameModal, {EntryNameModalState} from "../entry-name-modal/entry-name-modal";
import FilePreviewModal from "../file-preview-modal/file-preview-modal";
import UploadsProvider from "../uploads-provider/uploads-provider";
import FileManagerExplorer from "../file-manager-explorer/file-manager-explorer";

export default function FileManager() {
  const [currentFolder, setCurrentFolder] = useQueryState("folder");

  const [updateFiles, setUpdateFiles] = useState<number>(0);
  const [selectedEntries, setSelectedEntries] = useState<IFileEntry[]>([]);

  const [entriesInMemory, setEntriesInMemory] = useState<IFileEntry[]>([]);
  const [entriesInMemoryCut, setEntriesInMemoryCut] = useState<boolean>(false);
  const [nameModal, setNameModal] = useState<EntryNameModalState>(null);
  const [previewEntry, setPreviewEntry] = useState<IFileEntry | null>(null);

  const openFolder = (slug: string) => {
    setSelectedEntries(() => []);
    void setCurrentFolder(slug);
  }

  return(
    <FileExplorerContext
      value={{
        currentFolder: currentFolder,
        setCurrentFolder: setCurrentFolder,
        selectedEntries: selectedEntries,
        setSelectedEntries: setSelectedEntries,
        updateFiles: updateFiles,
        setUpdateFiles: setUpdateFiles
      }}
    >
      <UploadsProvider>
        <EntryNameModalContext
          value={{
            openCreateFolder: () => setNameModal(() => ({mode: "create"})),
            openRename: (entry) => setNameModal(() => ({mode: "rename", entry}))
          }}
        >
          <Space orientation="vertical" size="middle" style={{width: "100%"}}>
            {entriesInMemory.length != 0 && (
              <ClipboardBar entries={entriesInMemory} isCut={entriesInMemoryCut} onClear={() => setEntriesInMemory(() => [])}/>
            )}
            <FileManagerToolbar
              onCopy={(entries, isCut) => {
                setEntriesInMemory(() => entries);
                setEntriesInMemoryCut(() => isCut);
                setSelectedEntries(() => []);
              }}
            />
            <FileDropZone>
              <FileManagerExplorer openFolder={openFolder} preview={setPreviewEntry}/>
            </FileDropZone>
          </Space>
          <EntryNameModal state={nameModal} onClose={() => setNameModal(() => null)}/>
          <FilePreviewModal file={previewEntry} onClose={() => setPreviewEntry(() => null)}/>
        </EntryNameModalContext>
      </UploadsProvider>
    </FileExplorerContext>
  )
}
