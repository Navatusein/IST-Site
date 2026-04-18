import {IDirectory, IFile, IFileTypes} from "@/shared/services/file-manager-service/types/type";
import style from "./file-explorer.module.scss";
import {App, Space, Table, TableColumnsType, Typography} from "antd";
import {Key, useContext, useEffect, useState} from "react";
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
import {useServerAction} from "@/shared/hooks/use-server-action";
import {FileExplorerContext} from "@/shared/context/file-explorer-context/file-explorer-context";
import {useRouter} from "next/navigation";
import normalizeUrl from "normalize-url";

interface IProps {
  selectorType?: "radio" | "checkbox";
  filter?: IFileTypes[];
  allowPreview?: boolean;
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
    title: "Розширення файлу",
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

export default function FileExplorer(props: IProps) {
  const {notification} = App.useApp();
  const router = useRouter();
  const {
    currentPath,
    setCurrentPath,
    selectedRowKeys,
    setSelectedRowKeys,
    updateFiles,
  } = useContext(FileExplorerContext);

  const [loading, setLoading] = useState<boolean>(false);
  const [files, setFiles] = useState<(IFile|IDirectory)[]>([]);

  useEffect(() => {
    setLoading(() => true);

    useServerAction(getFilesAction(currentPath))
      .then((data) => {
        const filteredData = data.filter(x => {
          return props.filter != null ? ["directory", ...props.filter].includes(x.type) : true;
        });

        if (currentPath == "/")
          return setFiles(filteredData);

        setFiles([
          {name: "Назад", type: "back", size: 0, pathTo: getBackPath(currentPath), path: currentPath},
          ...filteredData
        ]);
      })
      .catch((error) => {
        notification.error({title: "Помилка завантаження файлів", description: error.message});

        if (error.message.includes("no such file or directory")) {
          setCurrentPath("/").catch((error) => {
            notification.error({title: "Помилка шляху", description: error.message});
          });
        }
      })
      .finally(() => {
        setLoading(() => false);
      })
  }, [currentPath, updateFiles, props.filter])

  const onRowSelect = (rowSelection: Key[]) => {
    setSelectedRowKeys(() => [...rowSelection]);
  }

  const onRowClick = (record: IFile) => {
    if (record.type == "directory" || record.type == "back") {
      setSelectedRowKeys(() => []);
      setCurrentPath((record as IDirectory).pathTo ?? "/")
        .catch((error) => {
          notification.error({title: "Помилка", description: error.message});
        });
    }
    else {
      if (props.allowPreview) {
        router.push(normalizeUrl(`${window.location.origin}/file/${record.path}`))
      }
      else {
        onRowSelect([record.path])
      }
    }
  }

  return (
    <Table<IFile|IDirectory>
      columns={COLUMNS}
      dataSource={files}
      size="small"
      rowClassName={style.row}
      rowHoverable={true}
      rowKey="path"
      pagination={false}
      scroll={{x: "auto"}}
      loading={loading}
      rowSelection={{
        type: props.selectorType ?? "checkbox",
        selectedRowKeys: selectedRowKeys,
        onChange: onRowSelect,
        getCheckboxProps: (record) => ({disabled: record.type === "back"}),
        renderCell: (checked, record, index, originNode) => (
          <div>
            <div
              style={{position: "absolute", top: 0, bottom: 0, left: 0, right: 0}}
              onClick={event => event.stopPropagation()}
            />
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
