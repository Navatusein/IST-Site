"use client"

import {Button, Flex, Modal} from "antd";
import {useEffect, useState} from "react";
import {IFileEntry, IFileTypes} from "../../../../types/type";
import {FileExplorer, FileExplorerContext} from "../../../file-explorer";

interface IProps {
  selectorType?: "radio" | "checkbox";
  filter?: IFileTypes[];
  initialSelection: IFileEntry[];
  onSubmit: (entries: IFileEntry[]) => void;
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

export default function SelectFilesModal(props: IProps) {
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);
  const [selectedEntries, setSelectedEntries] = useState<IFileEntry[]>([]);
  const [updateFiles, setUpdateFiles] = useState<number>(0);

  useEffect(() => {
    if (!props.isOpen)
      return;

    setSelectedEntries(() => props.initialSelection);
    setCurrentFolder(() => props.initialSelection[0]?.parentSlug ?? null);
  }, [props.isOpen]);

  const submitModal = () => {
    props.onSubmit(selectedEntries);
    props.setIsOpen(false);
  }

  return (
    <Modal
      closable
      open={props.isOpen}
      title="Оберіть файл"
      onCancel={() => props.setIsOpen(false)}
      width={1000}
      footer={null}
    >
      <FileExplorerContext value={{
        currentFolder: currentFolder,
        setCurrentFolder: (value) => Promise.resolve(setCurrentFolder(() => value)),
        selectedEntries: selectedEntries,
        setSelectedEntries: setSelectedEntries,
        updateFiles: updateFiles,
        setUpdateFiles: setUpdateFiles,
      }}>
        <Flex vertical gap="middle">
          <FileExplorer selectorType={props.selectorType} filter={props.filter}/>
          <Flex style={{width: "100%"}} gap="small">
            <Button style={{width: "50%"}} onClick={() => props.setIsOpen(false)}>
              Відмінити
            </Button>
            <Button type="primary" style={{width: "50%"}} onClick={submitModal}>
              Зберегти
            </Button>
          </Flex>
        </Flex>
      </FileExplorerContext>
    </Modal>
  )
}
