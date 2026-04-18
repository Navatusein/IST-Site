"use client"

import {Breadcrumb, Space, Tag, Typography} from "antd";
import {Key, useState} from "react";
import {useQueryState} from "nuqs";
import DownloadButton from "../download-button/download-button";
import UpdateButton from "../update-button/update-button";
import UploadFilesButton from "../upload-files-button/upload-files-button";
import CreateFolderButton from "../create-folder-button/create-folder-button";
import RenameButton from "../rename-button/rename-button";
import DeleteFilesButton from "../delete-files-button/delete-files-button";
import CopyCutPasteButtons from "../copy-cut-paste-buttons/copy-cut-paste-buttons";
import {FileExplorer} from "@/features/file-explorer";
import {FileExplorerContext} from "@/shared/context/file-explorer-context/file-explorer-context";

export default function FileManager() {
  const [currentPath, setCurrentPath] = useQueryState("path", {defaultValue: "/"});

  const [updateFiles, setUpdateFiles] = useState<number>(0);
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);

  const [filesInMemory, setFilesInMemory] = useState<string[]>([]);
  const [filesInMemoryCut, setFilesInMemoryCut] = useState<boolean>(false);

  return(
    <FileExplorerContext.Provider
      value={{
        currentPath: currentPath,
        setCurrentPath: setCurrentPath,
        selectedRowKeys: selectedRowKeys,
        setSelectedRowKeys: setSelectedRowKeys,
        updateFiles: updateFiles,
        setUpdateFiles: setUpdateFiles
      }}
    >
      <Space orientation="vertical" size="middle" style={{width: "100%"}}>
        <Space wrap size={[0, 0]}>
          <Typography.Text>Поточний шлях:</Typography.Text>
          <Breadcrumb items={currentPath?.split("/").map(value => ({title: value}))}/>
        </Space>
        {filesInMemory.length != 0 && (
          <Space wrap>
           <Typography.Text>
             {filesInMemoryCut ? "Вирізані файли:" : "Скопійовані файли:"}
           </Typography.Text>
           {filesInMemory.map(value => (
             <Tag style={{margin: 0}} color="blue" key={value}>
               {value.split("/").pop()}
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
            filesInMemory={filesInMemory}
            setFilesInMemory={setFilesInMemory}
            filesInMemoryCut={filesInMemoryCut}
            setFilesInMemoryCut={setFilesInMemoryCut}
          />
        </Space>
        <FileExplorer allowPreview/>
      </Space>
    </FileExplorerContext.Provider>

  )
}