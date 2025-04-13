import {useEffect, useState} from "react";
import {Button, Flex, Tag} from "antd";
import {IFileTypes} from "@/shared/services/file-manager-service/types/type";
import {SelectFilesModal} from "@/features/select-files-modal";

interface IProps {
  filter?: IFileTypes[];
  value?: string;
  onChange?: (value: string) => void;
}

export default function SelectFileButton(props: IProps) {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const [selectedFiles, setSelectedFiles] = useState<string[]>(props.value != null ? [props.value] : []);

  useEffect(() => {
    props.onChange?.(selectedFiles[0] ?? null);
  }, [selectedFiles]);

  const openModal = () => {
    setIsModalOpen(() => true);
  }

  const clearSelect = () => {
    setSelectedFiles(() => []);
  }

  return (
    <Flex vertical gap="small">
      <SelectFilesModal
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        selectorType="radio"
        filter={props.filter}
        selectFilePaths={selectedFiles}
        setSelectFilePaths={setSelectedFiles}
      />
      <Button block onClick={openModal}>
        Вибрати файл
      </Button>
      {props.value &&
        <Tag color="blue" style={{width: "fit-content"}} closable onClose={clearSelect}>
          {props.value}
        </Tag>
      }
    </Flex>
  )
}
