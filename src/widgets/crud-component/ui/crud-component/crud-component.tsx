"use client"

import {App, Button, Space, TableColumnsType, Tooltip} from "antd";
import {Dispatch, ReactNode, SetStateAction, useMemo, useState} from "react";
import CrudToolbar from "../crud-toolbar/crud-toolbar";
import CrudTable from "../crud-table/crud-table";
import CrudModal from "../crud-modal/crud-modal";
import CrudActionsDropdown from "../crud-actions-dropdown/crud-actions-dropdown";
import {IAdditionalMenuItem, IAdditionalToolbarButtons} from "../../types/type";

interface IProps<T> {
  columns: TableColumnsType<T>;
  data: T[] | undefined;
  isLoading: boolean;
  selectedRows: T[];
  setSelectedRows: Dispatch<SetStateAction<T[]>>;
  children: ReactNode;
  keyField?: string;
  refresh: () => void;
  create: (data: T) => Promise<void>;
  update: (data: T) => Promise<void>;
  remove: (data: T[]) => Promise<void>;
  additionalToolbarButtons?: IAdditionalToolbarButtons[];
  additionalDropdownMenuItems?: IAdditionalMenuItem<T>[];
}

export default function CrudComponent<T>(props: IProps<T>) {
  const {notification, modal} = App.useApp();

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);

  const columns = useMemo<TableColumnsType<T>>(() => (
    [
      ...props.columns,
      {
        title: "Дії",
        dataIndex: "actions",
        key: "actions",
        ellipsis: true,
        width: "40px",
        render: (_, record, __) => (
          <CrudActionsDropdown<T>
            value={record}
            setSelectedRows={props.setSelectedRows}
            onEdit={onEdit}
            onCopy={onCopy}
            onRemove={onRemove}
            additionalMenuItems={props.additionalDropdownMenuItems}
          />
        )
      }
    ]
  ), [props.columns]);

  const onFormSubmit = (formData: T) => {
    const action = isEdit ? props.update : props.create;

    setIsModalOpen(false);

    action(formData)
      .then(() => {
        props.setSelectedRows(() => []);
        props.refresh();

        notification.success({
          message: isEdit ? "Успішно збережено" : "Успішно створено"
        });
      })
      .catch((error) => {
        notification.error({
          message: isEdit ? "Помилка збереженя" : "Помилка створеня",
          description: error.message
        });
      });
  }

  const onRefresh = () => {
    props.setSelectedRows(() => []);
    props.refresh();
  }

  const onAdd = () => {
    props.setSelectedRows(() => []);
    setIsEdit(() => false);
    setIsModalOpen(() => true);
  }

  const onCopy = () => {
    setIsEdit(() => false);
    setIsModalOpen(() => true);
  }

  const onEdit = () => {
    setIsEdit(() => true);
    setIsModalOpen(() => true);
  }

  const onRemove = (rows?: T[]) => {
    modal.confirm({
      title: "Видалити",
      content: "Ви впевнені що хочите видалити вибрані рядки ?",
      okText: "Так",
      cancelText: "Ні",
      onOk: () => {
        props.remove(rows ?? props.selectedRows)
          .then(() => {
            props.setSelectedRows(() => []);
            props.refresh()

            notification.success({
              message: "Успішно видалено"
            })
          })
          .catch((error) => {
            notification.error({
              message: "Помилка видалення",
              description: error.message
            })
          });
      }
    });
  }

  return (
    <Space direction="vertical" size="middle" style={{width: "100%"}}>
      <CrudToolbar<T>
        selectedRows={props.selectedRows}
        onAdd={onAdd}
        onCopy={onCopy}
        onEdit={onEdit}
        onRemove={onRemove}
        onRefresh={onRefresh}
      />
      {props.additionalToolbarButtons != null && props.additionalToolbarButtons.map((additionalButton, index) => (
        <Tooltip title={additionalButton.tooltip}>
          <Button icon={additionalButton.icon} onClick={additionalButton.onClick} disabled={additionalButton.disabled}>
            {additionalButton.label}
          </Button>
        </Tooltip>
      ))}
      <CrudTable<T>
        columns={columns}
        data={props.data}
        isLoading={props.isLoading}
        selectedRows={props.selectedRows}
        setSelectedRows={props.setSelectedRows}
      />
      <CrudModal<T>
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        children={props.children}
        selectedRows={props.selectedRows}
        onFormSubmit={onFormSubmit}
        title={isEdit ? "Редагувати" : "Створити"}
      />
    </Space>
  )
}
