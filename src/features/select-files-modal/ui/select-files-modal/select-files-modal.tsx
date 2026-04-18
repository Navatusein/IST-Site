import {Button, Flex, Modal} from "antd";
import {FileExplorer} from "@/features/file-explorer";
import {Dispatch, Key, SetStateAction, useEffect, useState} from "react";
import {IFileTypes} from "@/shared/services/file-manager-service/types/type";
import {FileExplorerContext} from "@/shared/context/file-explorer-context/file-explorer-context";

interface IProps {
  selectorType?: "radio" | "checkbox";
  filter?: IFileTypes[];
  selectFilePaths: string[];
  setSelectFilePaths: Dispatch<SetStateAction<string[]>>;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export default function SelectFilesModal(props: IProps) {
  const [currentPath, setCurrentPath] = useState<string>("/");
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>(props.selectFilePaths);
  const [updateFiles, setUpdateFiles] = useState<number>(0);

  useEffect(() => {
    if (props.selectFilePaths.length == 0)
      setSelectedRowKeys(() => []);
  }, [props.selectFilePaths]);

  const closeModal = () => {
    props.setSelectFilePaths(() => []);
    props.setIsOpen(() => false);
  }

  const submitModal = () => {
    props.setSelectFilePaths(() => selectedRowKeys as string[]);
    props.setIsOpen(() => false);
  }

  return (
    <Modal
      closable
      open={props.isOpen}
      title="Оберіть файл"
      onCancel={() => {props.setIsOpen(false)}}
      width={1000}
      footer={null}
    >
      <FileExplorerContext value={{
        currentPath: currentPath,
        setCurrentPath: (value) => (new Promise((() => setCurrentPath(() => value)))),
        selectedRowKeys: selectedRowKeys,
        setSelectedRowKeys: setSelectedRowKeys,
        updateFiles: updateFiles,
        setUpdateFiles: setUpdateFiles,
      }}>
        <Flex vertical gap="middle">
          <FileExplorer selectorType={props.selectorType} filter={props.filter}/>
          <Flex style={{width: "100%"}} gap="small">
            <Button style={{width: "50%"}} onClick={closeModal}>
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
