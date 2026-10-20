"use client"

import {App, Button, Input, InputRef, Tooltip} from "antd";
import {useContext, useRef} from "react";
import {FolderAddOutlined} from "@ant-design/icons";
import {createDirectoryAction} from "@/entities/file/actions/actions";
import {FileExplorerContext} from "@/entities/file/ui";
import {unwrapServerAction} from "@/shared/utilities/unwrap-server-action";

export default function CreateFolderButton() {
  const {notification, modal} = App.useApp();
  const {currentFolder, setUpdateFiles} = useContext(FileExplorerContext);

  const directoryNameInput = useRef<InputRef>(null);

  const createFolder = () => {
    const directoryName = directoryNameInput.current?.input?.value.trim() ?? "";

    unwrapServerAction(createDirectoryAction(currentFolder, directoryName))
      .then(() => {
        notification.success({title: "Папку стоврено успішно",});
        setUpdateFiles((prevState) => prevState + 1);
      })
      .catch((error) => {
        notification.error({title: "Помилка створення папки", description: error.message});
      });
  }

  const onChange = (text: string, update: (configUpdate: any) => void) => {
    update({
      okButtonProps: {disabled: text.trim().length === 0},
    });
  }

  const openCreateFolderModal = () => {
    const modalInstance = modal.confirm({
      title: "Введіть назву папки",
      content:
        <Input
          ref={directoryNameInput}
          onChange={(e) => onChange(e.target.value, modalInstance.update)}
        />,
      okButtonProps: {disabled: true},
      okText: "Створити",
      cancelText: "Відмінити",
      onOk: () => createFolder()
    });
  }

  return (
    <Tooltip title="Стоворити нову папку">
      <Button icon={<FolderAddOutlined/>} onClick={openCreateFolderModal}>
        Створити папку
      </Button>
    </Tooltip>
  )
}
