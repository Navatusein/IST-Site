"use client"

import {Breadcrumb, Space, Tag, Typography} from "antd";
import {Key, useState} from "react";
import {IDirectory, IFile} from "@/shared/services/file-manager-service/types/type";
import {useQueryState} from "nuqs";
import FilePreview from "../file-preview/file-preview";
import DownloadButton from "../download-button/download-button";
import UpdateButton from "../update-button/update-button";
import UploadFilesButton from "../upload-files-button/upload-files-button";
import CreateFolderButton from "../create-folder-button/create-folder-button";
import RenameButton from "../rename-button/rename-button";
import DeleteFilesButton from "../delete-files-button/delete-files-button";
import CopyCutPasteButtons from "../copy-cut-paste-buttons/copy-cut-paste-buttons";
import {FileViewer} from "@/features/file-viewer";

export default function FileManager() {
  const [currentPath, setCurrentPath] = useQueryState("path", {defaultValue: "/"});

  const [updateFiles, setUpdateFiles] = useState<number>(0);
  const [files, setFiles] = useState<(IFile|IDirectory)[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);

  const [filePathToPreview, setFilePathToPreview] = useState<string>("");

  const [filesInMemory, setFilesInMemory] = useState<string[]>([]);
  const [filesInMemoryCut, setFilesInMemoryCut] = useState<boolean>(false);

  return(
    <Space direction="vertical" size="middle" style={{width: "100%"}}>
      <Space wrap size={[0, 0]}>
        <Typography.Text>Поточний шлях:</Typography.Text>
        <Breadcrumb items={currentPath?.split("/").map(value => ({title: value}))}/>
      </Space>
      {filesInMemory.length != 0 &&
       <Space wrap>
         <Typography.Text>
           {filesInMemoryCut ? "Вирізані файли:" : "Скопійовані файли:"}
         </Typography.Text>
         {filesInMemory.map(value => (<Tag style={{margin: 0}} color="blue" key={value}>{value.split("/").pop()}</Tag>))}
       </Space>
      }
      <Space wrap>
        <UpdateButton
          setUpdateFiles={setUpdateFiles}
        />
        <DownloadButton
          selectedRowKeys={selectedRowKeys}
          setSelectedRowKeys={setSelectedRowKeys}
        />
        <UploadFilesButton
          currentPath={currentPath}
          setUpdateFiles={setUpdateFiles}
        />
        <CreateFolderButton
          currentPath={currentPath}
          setUpdateFiles={setUpdateFiles}
        />
        <RenameButton
          selectedRowKeys={selectedRowKeys}
          setSelectedRowKeys={setSelectedRowKeys}
          setUpdateFiles={setUpdateFiles}
        />
        <DeleteFilesButton
          selectedRowKeys={selectedRowKeys}
          setSelectedRowKeys={setSelectedRowKeys}
          setUpdateFiles={setUpdateFiles}
        />
        <CopyCutPasteButtons
          currentPath={currentPath}
          selectedRowKeys={selectedRowKeys}
          setSelectedRowKeys={setSelectedRowKeys}
          filesInMemory={filesInMemory}
          setFilesInMemory={setFilesInMemory}
          filesInMemoryCut={filesInMemoryCut}
          setFilesInMemoryCut={setFilesInMemoryCut}
          setUpdateFiles={setUpdateFiles}
        />
      </Space>
      <FileViewer
        currentPath={currentPath}
        setCurrentPath={setCurrentPath}
        selectedRowKeys={selectedRowKeys}
        setSelectedRowKeys={setSelectedRowKeys}
        files={files}
        setFiles={setFiles}
        updateFiles={updateFiles}
      />
      <FilePreview filePathToPreview={filePathToPreview} setFilePathToPreview={setFilePathToPreview}/>
    </Space>
  )
}