import {IDirectory, IFile} from "@/shared/services/file-manager-service/types/type";
import style from "./file-viewer.module.scss";
import {App, Space, Table, TableColumnsType, Typography} from "antd";
import {Dispatch, Key, SetStateAction, useEffect} from "react";
import {getFilesAction} from "@/shared/services/file-manager-service/actions/actions";
import {
  FileImageOutlined,
  FileOutlined, FilePdfOutlined,
  FileTextOutlined,
  FileZipOutlined,
  FolderOutlined,
  RollbackOutlined,
  VideoCameraOutlined
} from "@ant-design/icons";

interface IProps {
  currentPath: string;
  setCurrentPath: (value: string) => Promise<any>;
  selectedRowKeys: Key[];
  setSelectedRowKeys: Dispatch<SetStateAction<Key[]>>;
  files: (IFile|IDirectory)[];
  setFiles: Dispatch<SetStateAction<(IFile|IDirectory)[]>>;
  updateFiles: number;
}

const FILE_TYPE_TO_ICON = {
  "directory": <FolderOutlined/>,
  "file": <FileOutlined/>,
  "archive": <FileZipOutlined/>,
  "video": <VideoCameraOutlined/>,
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
    title: "Розширеня файлу",
    dataIndex: "extension",
    key: "extension",
  }
];

const bytesToSize = (size: number): string => {
  const i = size == 0 ? 0 : Math.floor(Math.log(size) / Math.log(1024));
  return ((size / Math.pow(1024, i)).toFixed(2)) + " " + ["B", "kB", "MB", "GB", "TB"][i];
}

const getBackPath = (currentPath: string): string => {
  const pathParts = currentPath.split("/");
  pathParts.pop();
  return pathParts.join("/") || "/";
}

export default function FileViewer(props: IProps) {
  const {notification} = App.useApp();

  useEffect(() => {
    getFilesAction(props.currentPath)
      .then((data) => {
        if (props.currentPath == "/")
          return props.setFiles(data);

        props.setFiles([
          {name: "Назад", type: "back", size: 0, pathTo: getBackPath(props.currentPath), path: props.currentPath},
          ...data
        ]);
      })
      .catch((error) => {
        notification.error({message: "Помилка завантаження файлів", description: error.message});

        if (error.message.includes("no such file or directory"))
          props.setCurrentPath("/")
            .catch((error) => {
              notification.error({message: "Помилка шляху", description: error.message});
            });
      });
  }, [props.currentPath, props.updateFiles])

  const onRowSelect = (rowSelection: Key[]) => {
    props.setSelectedRowKeys(() => [...rowSelection]);
  }

  const onRowClick = (record: IFile) => {
    if (record.type == "directory" || record.type == "back") {
      props.setSelectedRowKeys(() => []);
      props.setCurrentPath((record as IDirectory).pathTo ?? "/")
        .catch((error) => {
          notification.error({message: "Помилка", description: error.message});
        });
    }
  }

  return (
    <Table<IFile|IDirectory>
      columns={COLUMNS}
      dataSource={props.files}
      size="small"
      rowClassName={style.row}
      rowHoverable={true}
      rowKey="path"
      pagination={false}
      scroll={{x: "auto"}}
      rowSelection={{
        selectedRowKeys: props.selectedRowKeys,
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
        onClick: () => onRowClick(record),
      })}
    />
  )
}
