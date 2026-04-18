"use client"

import {App, Button, Tooltip} from "antd";
import {useContext} from "react";
import {deleteFilesAction} from "@/shared/services/file-manager-service/actions/actions";
import {DeleteOutlined} from "@ant-design/icons";
import {useServerAction} from "@/shared/hooks/use-server-action";
import {FileExplorerContext} from "@/shared/context/file-explorer-context/file-explorer-context";

interface IProps {}

export default function DeleteFilesButton(props: IProps) {
  const {modal, notification} = App.useApp();
  const {selectedRowKeys, setSelectedRowKeys, setUpdateFiles} = useContext(FileExplorerContext);

  const deleteFiles = () => {
    modal.confirm({
      title: "Видалити файли",
      content: "Ви впевнені що хочете видалити ці файли?",
      okText: "Так",
      cancelText: "Ні",
      onOk: () => {
        useServerAction(deleteFilesAction(selectedRowKeys as string[]))
          .then(() => {
            notification.success({title: "Файли видалено успішно",});
            setSelectedRowKeys([]);
            setTimeout(() => {
              setUpdateFiles((prevState) => prevState + 1);
            }, 500)
          })
          .catch((error) => {
            notification.error({title: "Помилка видалення файлів", description: error.message});
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
        disabled={selectedRowKeys.length == 0}
      >
        Видалити
      </Button>
    </Tooltip>
  )
}