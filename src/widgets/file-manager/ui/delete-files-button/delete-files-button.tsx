"use client"

import {App, Button, Popconfirm, Tooltip} from "antd";
import {Dispatch, Key, SetStateAction} from "react";
import {deleteFilesAction} from "@/shared/services/file-manager-service/actions/actions";
import {DeleteOutlined} from "@ant-design/icons";
import {useServerAction} from "@/shared/hooks/use-server-action";

interface IProps {
  selectedRowKeys: Key[],
  setSelectedRowKeys: Dispatch<SetStateAction<Key[]>>
  setUpdateFiles: Dispatch<SetStateAction<number>>
}

export default function DeleteFilesButton(props: IProps) {
  const {modal, notification} = App.useApp();

  const deleteFiles = () => {
    modal.confirm({
      title: "Видалити файли",
      content: "Ви впевнені що хочете видалити ці файли?",
      okText: "Так",
      cancelText: "Ні",
      onOk: () => {
        useServerAction(deleteFilesAction(props.selectedRowKeys as string[]))
          .then(() => {
            notification.success({message: "Файли видалено успішно",});
            props.setSelectedRowKeys([]);
            setTimeout(() => {
              props.setUpdateFiles((prevState) => prevState + 1);
            }, 500)
          })
          .catch((error) => {
            notification.error({message: "Помилка видаленя файлів", description: error.message});
          });
      }
    });
  }

  return (
    <Tooltip title="Видалити вибрані файли">
      <Button
        icon={<DeleteOutlined/>}
        danger
        onClick={deleteFiles}
        disabled={props.selectedRowKeys.length == 0}
      >
        Видалити
      </Button>
    </Tooltip>
  )
}