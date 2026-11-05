"use client"

import {Flex} from "antd";
import fillHeight from "@/shared/styles/fill-height.module.scss";
import {ReactNode, useState} from "react";
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
import StorageUsage from "../storage-usage/storage-usage";
import {AdminPageHeader} from "@/shared/ui-kit";

interface IProps {
  title: string;
  description?: ReactNode;
}

// Renders the page header itself, so the disk usage next to it updates with the list
export default function FileManager(props: IProps) {
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
          <AdminPageHeader title={props.title} description={props.description} titleExtra={<StorageUsage/>}/>
          <Flex vertical gap="middle" className={fillHeight.fill}>
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
          </Flex>
          <EntryNameModal state={nameModal} onClose={() => setNameModal(() => null)}/>
          <FilePreviewModal file={previewEntry} onClose={() => setPreviewEntry(() => null)}/>
        </EntryNameModalContext>
      </UploadsProvider>
    </FileExplorerContext>
  )
}
