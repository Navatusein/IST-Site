"use client"

import {App, Breadcrumb, Button, Space, Table, TableColumnsType, Tag, Typography} from "antd";
import {FileImageOutlined, FileOutlined, FilePdfOutlined, FileTextOutlined, FolderOutlined, RollbackOutlined} from "@ant-design/icons";
import {Key, useEffect, useState} from "react";
import {IDirectory, IFile} from "@/shared/services/file-manager-service/types/type";
import {getFilesAction} from "@/shared/services/file-manager-service/actions/actions";
import {useQueryState} from "nuqs";
import {
  CopyCutPasteButtons,
  CreateFolderButton,
  DeleteFilesButton,
  RenameButton,
  UploadFilesButton
} from "@/widgets/file-manager";
import style from "./file-manager.module.scss"
import FilePreview from "../file-preview/file-preview";

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
  const pathParts = currentPath.split("/");
  pathParts.pop();
  return pathParts.join("/") || "/";
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
    ellipsis: true,
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
    ellipsis: true,
    render: (value, record) => (
      <Typography.Text>
        {record.type != "directory" && record.type != "back" && bytesToSize(value)}
      </Typography.Text>
    )
  },
  {
    title: "Шлях",
    dataIndex: "path",
    key: "path",
  },
  {
    title: "Розширеня файлу",
    dataIndex: "extension",
    key: "extension",
  }
];

export default function FileManager() {
  const {notification} = App.useApp();

  const [currentPath, setCurrentPath] = useQueryState("path", {defaultValue: "/"});

  const [updateFiles, setUpdateFiles] = useState<number>(0);
  const [files, setFiles] = useState<(IFile|IDirectory)[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);

  const [filePathToPreview, setFilePathToPreview] = useState<string>("");

  const [filesInMemory, setFilesInMemory] = useState<string[]>([]);
  const [filesInMemoryCut, setFilesInMemoryCut] = useState<boolean>(false);

  useEffect(() => {
    getFilesAction(currentPath)
      .then((data) => {
        if (currentPath == "/")
          return setFiles(data);

        setFiles([
          {name: "Назад", type: "back", size: 0, pathTo: getBackPath(currentPath), path: currentPath},
          ...data
        ]);
      })
      .catch((error) => {
        notification.error({message: "Помилка завантаження файлів", description: error.message});

        if (error.message.includes("no such file or directory"))
          setCurrentPath("/")
            .catch((error) => {
              notification.error({message: "Помилка", description: error.message});
            });
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
      // setFilePathToPreview(() => record.path);
    }
  }

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
        <Button onClick={() => setUpdateFiles((prevState) => prevState + 1)}>
          Оновити
        </Button>
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
      <Table<IFile|IDirectory>
        columns={COLUMNS}
        dataSource={files}
        size="small"
        rowClassName={style.row}
        rowHoverable={true}
        rowKey="path"
        pagination={false}
        scroll={{x: "auto"}}
        rowSelection={{
          selectedRowKeys: selectedRowKeys,
          onChange: onRowSelect,
          getCheckboxProps: (record) => ({disabled: record.type === "back"}),
          renderCell: (checked, record, index, originNode) => (
            <div>
              <div style={{position: "absolute", top: 0, bottom: 0, left: 0, right: 0}} onClick={event => event.stopPropagation()}/>
              {originNode}
            </div>
          )
        }}
        onRow={(record: IFile, rowIndex?: number) => ({
          onClick: () => onRowClick(record)
        })}
      />
      <FilePreview filePathToPreview={filePathToPreview} setFilePathToPreview={setFilePathToPreview}/>
    </Space>
  )
}