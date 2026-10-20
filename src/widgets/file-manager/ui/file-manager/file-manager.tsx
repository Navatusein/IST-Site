"use client"

import {Space, Tag, Typography} from "antd";
import {useState} from "react";
import {useQueryState} from "nuqs";
import {IFileEntry} from "@/entities/file";
import {FileExplorer, FileExplorerContext} from "@/entities/file/ui";
import DownloadButton from "../download-button/download-button";
import UpdateButton from "../update-button/update-button";
import UploadFilesButton from "../upload-files-button/upload-files-button";
import CreateFolderButton from "../create-folder-button/create-folder-button";
import RenameButton from "../rename-button/rename-button";
import DeleteFilesButton from "../delete-files-button/delete-files-button";
import CopyCutPasteButtons from "../copy-cut-paste-buttons/copy-cut-paste-buttons";
import ExportImportButtons from "../export-import-buttons/export-import-buttons";
import FileDropZone from "../file-drop-zone/file-drop-zone";
import FileRowActions from "../file-row-actions/file-row-actions";
import {useFileActions} from "../../model/use-file-actions";
import {EntryNameModalContext} from "../../model/entry-name-modal-context";
import EntryNameModal, {EntryNameModalState} from "../entry-name-modal/entry-name-modal";
import FilePreviewModal from "../file-preview-modal/file-preview-modal";

export default function FileManager() {
  const [currentFolder, setCurrentFolder] = useQueryState("folder");

  const [updateFiles, setUpdateFiles] = useState<number>(0);
  const [selectedEntries, setSelectedEntries] = useState<IFileEntry[]>([]);

  const [entriesInMemory, setEntriesInMemory] = useState<IFileEntry[]>([]);
  const [entriesInMemoryCut, setEntriesInMemoryCut] = useState<boolean>(false);
  const [nameModal, setNameModal] = useState<EntryNameModalState>(null);
  const [previewEntry, setPreviewEntry] = useState<IFileEntry | null>(null);

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
      <EntryNameModalContext
        value={{
          openCreateFolder: () => setNameModal(() => ({mode: "create"})),
          openRename: (entry) => setNameModal(() => ({mode: "rename", entry}))
        }}
      >
        <Space orientation="vertical" size="middle" style={{width: "100%"}}>
          {entriesInMemory.length != 0 && (
            <Space wrap>
              <Typography.Text>
                {entriesInMemoryCut ? "Вирізані файли:" : "Скопійовані файли:"}
              </Typography.Text>
              {entriesInMemory.map(entry => (
                <Tag style={{margin: 0}} color="blue" key={entry.slug}>
                  {entry.name}
                </Tag>
              ))}
            </Space>
          )}
          <Space wrap>
            <UpdateButton/>
            <DownloadButton/>
            <UploadFilesButton/>
            <CreateFolderButton/>
            <RenameButton/>
            <DeleteFilesButton/>
            <CopyCutPasteButtons
              entriesInMemory={entriesInMemory}
              setEntriesInMemory={setEntriesInMemory}
              entriesInMemoryCut={entriesInMemoryCut}
              setEntriesInMemoryCut={setEntriesInMemoryCut}
            />
            <ExportImportButtons/>
          </Space>
          <FileDropZone>
            <FileManagerExplorer openFolder={(slug) => setCurrentFolder(slug)} preview={setPreviewEntry}/>
          </FileDropZone>
        </Space>
        <EntryNameModal state={nameModal} onClose={() => setNameModal(() => null)}/>
        <FilePreviewModal file={previewEntry} onClose={() => setPreviewEntry(() => null)}/>
      </EntryNameModalContext>
    </FileExplorerContext>
  )
}

interface IFileManagerExplorerProps {
  openFolder: (slug: string) => void;
  preview: (entry: IFileEntry) => void;
}

function FileManagerExplorer(props: IFileManagerExplorerProps) {
  const {move} = useFileActions();

  return (
    <FileExplorer
      onPreview={props.preview}
      onMove={move}
      renderActions={(entry) => <FileRowActions entry={entry} openFolder={props.openFolder} preview={props.preview}/>}
    />
  )
}
