import {Button, Card, Flex, Modal} from "antd";
import {FileViewer} from "@/features/file-viewer";
import {Dispatch, Key, SetStateAction, useEffect, useState} from "react";
import {IDirectory, IFile, IFileTypes} from "@/shared/services/file-manager-service/types/type";

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
  const [files, setFiles] = useState<(IFile|IDirectory)[]>([]);
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
      <Flex vertical gap="middle">
        <FileViewer
          selectorType={props.selectorType}
          filter={props.filter}
          currentPath={currentPath}
          setCurrentPath={(value) => (new Promise((() => setCurrentPath(() => value))))}
          selectedRowKeys={selectedRowKeys}
          setSelectedRowKeys={setSelectedRowKeys}
          files={files}
          setFiles={setFiles}
          updateFiles={updateFiles}
        />
        <Flex style={{width: "100%"}} gap="small">
          <Button style={{width: "50%"}} onClick={closeModal}>
            Відмінити
          </Button>
          <Button type="primary" style={{width: "50%"}} onClick={submitModal}>
            Зберегти
          </Button>
        </Flex>
      </Flex>
    </Modal>
  )
}
