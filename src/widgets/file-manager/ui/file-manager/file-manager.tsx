"use client"

import {App, Space, Table, TableColumnsType, Typography} from "antd";
import {FileImageOutlined, FileOutlined, FilePdfOutlined, FileTextOutlined, FolderOutlined, RollbackOutlined} from "@ant-design/icons";
import {Key, useEffect, useState} from "react";
import {IDirectory, IFile} from "@/shared/services/file-manager-service/types/type";
import {getFilesAction} from "@/shared/services/file-manager-service/actions/actions";
import {useQueryState} from "nuqs";
import {CreateFolderButton, DeleteFilesButton, UploadFilesButton} from "@/widgets/file-manager";

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
      <Space>
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
    )
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
      setCurrentPath((record as IDirectory).pathTo ?? "/")
        .catch((error) => {
          notification.error({message: "Помилка", description: error.message});
        });
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
      <Table
        columns={COLUMNS}
        dataSource={files}
        size="small"
        rowKey="path"
        rowSelection={{
          selectedRowKeys: selectedRowKeys,
          onChange: onRowSelect
        }}
        onRow={(record: IFile, rowIndex?: number) => ({
          onClick: () => onRowClick(record)
        })}
      />
    </Space>

  )
}