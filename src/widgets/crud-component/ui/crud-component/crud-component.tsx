import {App, Space, TableColumnsType} from "antd";
import {Dispatch, ReactNode, SetStateAction, useState} from "react";
import {CrudModal, CrudTable, CrudToolbar} from "@/widgets/crud-component";

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
}

export default function CrudComponent<T>(props: IProps<T>) {
  const {notification} = App.useApp();

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);

  const onFormSubmit = (formData: T) => {
    const action = isEdit ? props.update : props.create;

    setIsModalOpen(false);

    action(formData)
      .then(() => {
        props.setSelectedRows(() => []);
        props.refresh()

        notification.success({
          message: isEdit ? "Успішно збережено" : "Успішно створено"
        })
      })
      .catch((error) => {
        notification.error({
          message: isEdit ? "Помилка збереженя" : "Помилка створеня",
          description: error.message
        })
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

  const onRemove = () => {
    props.remove(props.selectedRows)
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
      <CrudTable<T>
        columns={props.columns}
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
