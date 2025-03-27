import {Dispatch, Key, SetStateAction} from "react";
import {App, Button, Space} from "antd";
import {moveOrCopyFilesAction} from "@/shared/services/file-manager-service/actions/actions";

interface IProps {
  currentPath: string;
  selectedRowKeys: Key[],
  setSelectedRowKeys: Dispatch<SetStateAction<Key[]>>
  filesInMemory: string[],
  setFilesInMemory: Dispatch<SetStateAction<string[]>>
  filesInMemoryCut: boolean,
  setFilesInMemoryCut: Dispatch<SetStateAction<boolean>>
  setUpdateFiles: Dispatch<SetStateAction<number>>
}

export default function CopyCutPasteButtons(props: IProps) {
  const {notification} = App.useApp();

  const pasteFromMemory = () => {
    moveOrCopyFilesAction(props.currentPath, props.filesInMemory, props.filesInMemoryCut)
      .then(() => {
        notification.success({message: "Успіх"});
        props.setFilesInMemory(() => []);
        setTimeout(() => {
          props.setUpdateFiles((prevState) => prevState + 1)
        }, 500)
      })
      .catch((error) => {
        notification.error({message: "Помилка", description: error.message});
      });
  }

  const copyOrCut = (cut: boolean) => {
    props.setFilesInMemory(() => props.selectedRowKeys as string[]);
    props.setSelectedRowKeys(() => []);
    props.setFilesInMemoryCut(() => cut);
  }

  const clearMemory = () => {
    props.setFilesInMemory(() => []);
    props.setSelectedRowKeys(() => []);
    props.setFilesInMemoryCut(() => false);
  }

  return (
    <Space wrap>
      <Button onClick={() => copyOrCut(false)} disabled={props.selectedRowKeys.length == 0}>
        Копіювати
      </Button>
      <Button onClick={() => copyOrCut(true)} disabled={props.selectedRowKeys.length == 0}>
        Вирізати
      </Button>
      {props.filesInMemory.length != 0 &&
        <Button onClick={clearMemory}>
          {props.filesInMemoryCut ? "Забути вирізане" : "Забути скопійоване"}
        </Button>
      }
      {props.filesInMemory.length != 0 &&
        <Button onClick={pasteFromMemory}>
          Вставити
        </Button>
      }
    </Space>
  )
}
