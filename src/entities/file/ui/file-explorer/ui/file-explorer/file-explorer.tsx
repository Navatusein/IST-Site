"use client"

import style from "./file-explorer.module.scss";
import {App, Breadcrumb, Flex, Space, Table, TableColumnsType, Typography} from "antd";
import {DragEvent, ReactNode, useContext, useEffect, useState} from "react";
import {FolderOutlined, RollbackOutlined} from "@ant-design/icons";
import {IFileEntry, IFileTypes, IFolderBreadcrumb} from "../../../../types/type";
import {getFolderAction} from "../../../../actions/actions";
import {unwrapServerAction} from "@/shared/utilities/unwrap-server-action";
import formatFileSize from "@/shared/utilities/format-file-size";
import {FileExplorerContext} from "../../context/file-explorer-context";
import FileTypeIcon, {getFileTypeLabel} from "../../../file-type-icon/file-type-icon";

interface IProps {
  selectorType?: "radio" | "checkbox";
  filter?: IFileTypes[];
  onPreview?: (entry: IFileEntry) => void;
  renderActions?: (entry: IFileEntry) => ReactNode;
  onMove?: (slugs: string[], targetSlug: string | null) => void;
}

interface IExplorerRow extends IFileEntry {
  backTo?: string | null;
}

const BACK_ROW_SLUG = "..";

const DRAG_TYPE = "application/x-ist-file-entries";

const ROOT_TARGET = "__root__";

const isEntryDrag = (event: DragEvent) => event.dataTransfer.types.includes(DRAG_TYPE);

const entryIcon = (record: IExplorerRow) => {
  if (record.type == "back")
    return <RollbackOutlined/>;

  return record.kind == "directory" ? <FolderOutlined style={{color: "var(--ant-color-primary)"}}/> : <FileTypeIcon file={record}/>;
}

const entryTypeLabel = (record: IExplorerRow) => {
  if (record.type == "back")
    return " ";

  return record.kind == "directory" ? "Папка" : getFileTypeLabel(record);
}

const COLUMNS: TableColumnsType<IExplorerRow> = [
  {
    title: "Назва",
    dataIndex: "name",
    key: "name",
    render: (value, record) => (
      <Space style={{cursor: "pointer"}}>
        {entryIcon(record)}
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
        {entryTypeLabel(record)}
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
  const [dropTarget, setDropTarget] = useState<string | null>(null);

  useEffect(() => {
    let isCancelled = false;
    setLoading(() => true);

    unwrapServerAction(getFolderAction(currentFolder))
      .then((folder) => {
        if (isCancelled)
          return;

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
        if (isCancelled)
          return;

        notification.error({title: "Помилка завантаження файлів", description: error.message});

        if (currentFolder != null)
          navigate(null);
      })
      .finally(() => {
        if (!isCancelled)
          setLoading(() => false);
      });

    return () => {
      isCancelled = true;
    };
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

    if (props.onPreview)
      props.onPreview(record);
    else if (props.selectorType == "checkbox")
      setSelectedEntries((prevState) => prevState.some((x) => x.slug == record.slug) ?
        prevState.filter((x) => x.slug != record.slug) :
        [...prevState, record]
      );
    else
      setSelectedEntries(() => [record]);
  }

  const dropHandlers = (targetSlug: string | null) => {
    const key = targetSlug ?? ROOT_TARGET;

    return {
      onDragOver: (event: DragEvent) => {
        if (!isEntryDrag(event))
          return;

        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
        setDropTarget(() => key);
      },
      onDragLeave: (event: DragEvent) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null))
          setDropTarget((value) => value == key ? null : value);
      },
      onDrop: (event: DragEvent) => {
        if (!isEntryDrag(event))
          return;

        event.preventDefault();
        setDropTarget(() => null);

        const slugs = (JSON.parse(event.dataTransfer.getData(DRAG_TYPE) || "[]") as string[]).filter((slug) => slug != targetSlug);

        if (slugs.length != 0)
          props.onMove?.(slugs, targetSlug);
      }
    };
  }

  const dragHandlers = (record: IExplorerRow) => ({
    draggable: true,
    onDragStart: (event: DragEvent) => {
      const isSelected = selectedEntries.some((x) => x.slug == record.slug);
      const slugs = isSelected ? selectedEntries.map((x) => x.slug) : [record.slug];

      event.dataTransfer.setData(DRAG_TYPE, JSON.stringify(slugs));
      event.dataTransfer.effectAllowed = "move";
    },
    onDragEnd: () => setDropTarget(() => null)
  });

  const rowDropTarget = (record: IExplorerRow): string | null | undefined => {
    if (record.type == "back")
      return record.backTo ?? null;

    return record.kind == "directory" ? record.slug : undefined;
  }

  const columns: TableColumnsType<IExplorerRow> = props.renderActions ? [
    ...COLUMNS,
    {
      key: "actions",
      width: 56,
      align: "center",
      render: (_, record) => record.type == "back" ? null : (
        <span onClick={(event) => event.stopPropagation()}>
          {props.renderActions!(record)}
        </span>
      )
    }
  ] : COLUMNS;

  return (
    <Flex vertical gap="small">
      <Breadcrumb
        items={breadcrumbs.map((breadcrumb, index) => ({
          title: index == breadcrumbs.length - 1 ?
            breadcrumb.name :
            <Typography.Link
              onClick={() => navigate(breadcrumb.slug)}
              className={dropTarget == (breadcrumb.slug ?? ROOT_TARGET) ? style.dropTarget : undefined}
              {...(props.onMove ? dropHandlers(breadcrumb.slug) : {})}
            >
              {breadcrumb.name}
            </Typography.Link>
        }))}
      />
      <Table<IExplorerRow>
        columns={columns}
        dataSource={rows}
        size="small"
        rowClassName={(record) => {
          const target = rowDropTarget(record);
          return target !== undefined && dropTarget == (target ?? ROOT_TARGET) ? `${style.row} ${style.dropTarget}` : style.row;
        }}
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
        onRow={(record) => {
          const target = rowDropTarget(record);

          return {
            onClick: () => onRowClick(record),
            ...(props.onMove && record.type != "back" ? dragHandlers(record) : {}),
            ...(props.onMove && target !== undefined ? dropHandlers(target) : {})
          };
        }}
      />
    </Flex>
  )
}
