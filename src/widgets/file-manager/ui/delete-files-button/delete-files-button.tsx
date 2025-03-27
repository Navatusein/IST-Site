"use client"

import {App, Button, Popconfirm} from "antd";
import {Dispatch, Key, SetStateAction} from "react";
import {deleteFilesAction} from "@/shared/services/file-manager-service/actions/actions";

interface IProps {
  currentPath: string;
  selectedRowKeys: Key[],
  setSelectedRowKeys: Dispatch<SetStateAction<Key[]>>
  setUpdateFiles: Dispatch<SetStateAction<number>>
}

export default function DeleteFilesButton(props: IProps) {
  const {notification} = App.useApp();

  const deleteFiles = () => {
    deleteFilesAction(props.selectedRowKeys as string[])
      .then(() => {
        notification.success({message: "Файли видалено успішно",});
        props.setSelectedRowKeys([]);
        props.setUpdateFiles((prevState) => prevState + 1);
      })
      .catch((error) => {
        notification.error({message: "Помилка видаленя файлів", description: error.message});
      });
  }

  return (
    <Popconfirm
      title="Видалити файли"
      description="Ви впевнені що хочете видалити ці файли?"
      onConfirm={deleteFiles}
      okText="Так"
      cancelText="Ні"
    >
      <Button danger disabled={props.selectedRowKeys.length == 0}>Видалити</Button>
    </Popconfirm>
  )
}