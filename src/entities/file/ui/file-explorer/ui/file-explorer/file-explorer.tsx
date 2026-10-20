"use client"

import style from "./file-explorer.module.scss";
import {App, Breadcrumb, Flex, Space, Table, TableColumnsType, Typography} from "antd";
import {useContext, useEffect, useState} from "react";
import {
  FileImageOutlined,
  FileOutlined, FilePdfOutlined,
  FileTextOutlined,
  FileZipOutlined,
  FolderOutlined,
  RollbackOutlined,
  VideoCameraOutlined
} from "@ant-design/icons";
import {useRouter} from "next/navigation";
import {IFileEntry, IFileTypes, IFolderBreadcrumb} from "../../../../types/type";
import {getFolderAction} from "../../../../actions/actions";
import {unwrapServerAction} from "@/shared/utilities/unwrap-server-action";
import {getFileViewUrl} from "@/shared/utilities/file-urls";
import formatFileSize from "@/shared/utilities/format-file-size";
import {FileExplorerContext} from "../../context/file-explorer-context";

interface IProps {
  selectorType?: "radio" | "checkbox";
  filter?: IFileTypes[];
  allowPreview?: boolean;
}

interface IExplorerRow extends IFileEntry {
  backTo?: string | null;
}

const BACK_ROW_SLUG = "..";

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

const COLUMNS: TableColumnsType<IExplorerRow> = [
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
        {record.kind == "file" && formatFileSize(value)}
      </Typography.Text>
    )
  },
  {
    title: "Розширення файлу",
    dataIndex: "extension",
    key: "extension",
  }
];

export default function FileExplorer(props: IProps) {
  const {notification} = App.useApp();
  const router = useRouter();
  const {
    currentFolder,
    setCurrentFolder,
    selectedEntries,
    setSelectedEntries,
    updateFiles,
  } = useContext(FileExplorerContext);

  const [loading, setLoading] = useState<boolean>(false);
  const [rows, setRows] = useState<IExplorerRow[]>([]);
  const [breadcrumbs, setBreadcrumbs] = useState<IFolderBreadcrumb[]>([]);

  useEffect(() => {
    setLoading(() => true);

    unwrapServerAction(getFolderAction(currentFolder))
      .then((folder) => {
        const entries = folder.entries.filter((x) => (
          props.filter != null ? x.kind == "directory" || props.filter.includes(x.type) : true
        ));

        setBreadcrumbs(() => folder.breadcrumbs);

        if (currentFolder == null)
          return setRows(() => entries);

        const backRow: IExplorerRow = {
          slug: BACK_ROW_SLUG,
          name: "Назад",
          kind: "directory",
          type: "back",
          parentSlug: currentFolder,
          size: 0,
          backTo: folder.breadcrumbs.at(-2)?.slug ?? null
        };

        setRows(() => [backRow, ...entries]);
      })
      .catch((error) => {
        notification.error({title: "Помилка завантаження файлів", description: error.message});

        if (currentFolder != null)
          navigate(null);
      })
      .finally(() => {
        setLoading(() => false);
      });
  }, [currentFolder, updateFiles, props.filter?.join()]);

  const navigate = (folderSlug: string | null) => {
    setSelectedEntries(() => []);
    setCurrentFolder(folderSlug)
      .catch((error) => {
        notification.error({title: "Помилка", description: error.message});
      });
  }

  const onRowClick = (record: IExplorerRow) => {
    if (record.type == "back")
      return navigate(record.backTo ?? null);

    if (record.kind == "directory")
      return navigate(record.slug);

    if (props.allowPreview)
      router.push(getFileViewUrl(record.slug));
    else if (props.selectorType == "checkbox")
      setSelectedEntries((prevState) => prevState.some((x) => x.slug == record.slug) ?
        prevState.filter((x) => x.slug != record.slug) :
        [...prevState, record]
      );
    else
      setSelectedEntries(() => [record]);
  }

  return (
    <Flex vertical gap="small">
      <Breadcrumb
        items={breadcrumbs.map((breadcrumb, index) => ({
          title: index == breadcrumbs.length - 1 ?
            breadcrumb.name :
            <Typography.Link onClick={() => navigate(breadcrumb.slug)}>{breadcrumb.name}</Typography.Link>
        }))}
      />
      <Table<IExplorerRow>
        columns={COLUMNS}
        dataSource={rows}
        size="small"
        rowClassName={style.row}
        rowHoverable={true}
        rowKey="slug"
        pagination={false}
        scroll={{x: "auto"}}
        loading={loading}
        rowSelection={{
          type: props.selectorType ?? "checkbox",
          selectedRowKeys: selectedEntries.map((x) => x.slug),
          onChange: (_, selectedRows) => setSelectedEntries(() => selectedRows.filter((x) => x.type != "back")),
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
        onRow={(record) => ({
          onClick: () => onRowClick(record),
        })}
      />
    </Flex>
  )
}
