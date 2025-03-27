"use client"

import {App, Button, Modal, Space, Table, TableColumnsType, Typography} from "antd";
import {FileImageOutlined, FileOutlined, FilePdfOutlined, FileTextOutlined, FolderOutlined, RollbackOutlined} from "@ant-design/icons";
import {Key, useEffect, useState} from "react";
import {IDirectory, IFile} from "@/shared/services/file-manager-service/types/type";
import {getFilesAction} from "@/shared/services/file-manager-service/actions/actions";
import {useQueryState} from "nuqs";
import {CreateFolderButton, DeleteFilesButton, UploadFilesButton} from "@/widgets/file-manager";
import style from "./file-manager.module.scss"
import {DocumentViewer} from "react-documents";
import FilePreview from "../file-preview/file-preview";

interface IProps {}

const FILE_TYPE_TO_ICON = {
  "directory": <FolderOutlined/>,
  "file": <FileOutlined/>,
  "archive": <FileOutlined/>,
  "video": <FileOutlined/>,
  "back": <RollbackOutlined/>,
  "text": <FileTextOutlined/>,
  "image": <FileImageOutlined/>,
  "pdf": <FilePdfOutlined/>
}

const FILE_TYPE_TO_UKR = {
  "directory": "Папка",
  "file": "Файл",
  "archive": "Архів",
  "video": "Відео",
  "back": " ",
  "text": "Текст",
  "image": "Малюнок",
  "pdf": "PDF"
}


const bytesToSize = (size: number): string => {
  const i = size == 0 ? 0 : Math.floor(Math.log(size) / Math.log(1024));
  return ((size / Math.pow(1024, i)).toFixed(2)) + " " + ["B", "kB", "MB", "GB", "TB"][i];
}

const getBackPath = (currentPath: string): string => {
  const pathParts = currentPath.split("\\");
  pathParts.pop();
  return pathParts.join("\\") || "\\";
}

const COLUMNS: TableColumnsType<IFile|IDirectory> = [
  {
    title: "Назва",
    dataIndex: "name",
    key: "name",
    render: (value, record) => (
      <Space style={{cursor: "pointer"}}>
        {FILE_TYPE_TO_ICON[record.type] || <FileOutlined/>}
        {value}
      </Space>
    )
  },
  {
    title: "Тип",
    dataIndex: "type",
    key: "type",
    render: (value, record) => (
      <Typography.Text>
        {FILE_TYPE_TO_UKR[record.type] || value}
      </Typography.Text>
    ),
  },
  {
    title: "Розмір",
    dataIndex: "size",
    key: "size",
    render: (value, record) => (
      <Typography.Text>
        {record.type != "directory" && record.type != "back" && bytesToSize(value)}
      </Typography.Text>
    )
  },
  {
    title: "Дії",
    dataIndex: "actions",
    key: "actions",
    render: (value, record) => (
      <Space>

      </Space>
    )
  }
];

export default function FileManager(props: IProps) {
  const {notification} = App.useApp();

  const [currentPath, setCurrentPath] = useQueryState("path", {defaultValue: "\\"});

  const [updateFiles, setUpdateFiles] = useState<number>(0)
  const [files, setFiles] = useState<(IFile|IDirectory)[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);

  const [filePathToPreview, setFilePathToPreview] = useState<string>("")

  useEffect(() => {
    getFilesAction(currentPath)
      .then((data) => {
        if (currentPath == "\\")
          return setFiles(data);

        setFiles([
          {name: "Назад", type: "back", size: 0, pathTo: getBackPath(currentPath), path: currentPath},
          ...data
        ]);
      })
      .catch((error) => {
        notification.error({message: "Помилка завантаження файлів", description: error.message});
      });
  }, [currentPath, updateFiles])

  const onRowSelect = (rowSelection: Key[]) => {
    setSelectedRowKeys(() => [...rowSelection]);
  }

  const onRowClick = (record: IFile) => {
    if (record.type == "directory" || record.type == "back") {
      setSelectedRowKeys(() => []);
      setCurrentPath((record as IDirectory).pathTo ?? "/")
        .catch((error) => {
          notification.error({message: "Помилка", description: error.message});
        });
    }
    else {
      setFilePathToPreview(() => record.path);
    }
  }

  return(
    <Space direction="vertical" size="middle" style={{width: "100%"}}>
      <Space>
        <UploadFilesButton
          currentPath={currentPath}
          setUpdateFiles={setUpdateFiles}
        />
        <CreateFolderButton
          currentPath={currentPath}
          setUpdateFiles={setUpdateFiles}
        />
        <DeleteFilesButton
          currentPath={currentPath}
          selectedRowKeys={selectedRowKeys}
          setSelectedRowKeys={setSelectedRowKeys}
          setUpdateFiles={setUpdateFiles}
        />
      </Space>
      <Table<IFile|IDirectory>
        columns={COLUMNS}
        dataSource={files}
        size="small"
        rowClassName={style.row}
        rowHoverable={true}
        rowKey="path"
        rowSelection={{
          selectedRowKeys: selectedRowKeys,
          onChange: onRowSelect,
          selections: true
        }}
        onRow={(record: IFile, rowIndex?: number) => ({
          onClick: () => onRowClick(record)
        })}
      />
      <FilePreview filePathToPreview={filePathToPreview} setFilePathToPreview={setFilePathToPreview}/>
    </Space>
  )
}