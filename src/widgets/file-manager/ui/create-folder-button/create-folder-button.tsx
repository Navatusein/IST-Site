"use client"

import {App, Button, Input, InputRef} from "antd";
import {Dispatch, SetStateAction, useRef} from "react";
import {createDirectoryAction} from "@/shared/services/file-manager-service/actions/actions";

interface IProps {
  currentPath: string;
  setUpdateFiles: Dispatch<SetStateAction<number>>
}

export default function CreateFolderButton(props: IProps) {
  const {notification, modal} = App.useApp();

  const directoryNameInput = useRef<InputRef>(null);

  const createFolder = () => {
    const directoryName = directoryNameInput.current?.input?.value.trim() ?? "";

    createDirectoryAction(props.currentPath, directoryName)
      .then(() => {
        notification.success({message: "Папку стоврено успішно",});
        setTimeout(() => {
          props.setUpdateFiles((prevState) => prevState + 1);
        }, 500)
      })
      .catch((error) => {
        notification.error({message: "Помилка створення папки", description: error.message});
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
    <Button onClick={openCreateFolderModal}>
      Створити папку
    </Button>
  )
}