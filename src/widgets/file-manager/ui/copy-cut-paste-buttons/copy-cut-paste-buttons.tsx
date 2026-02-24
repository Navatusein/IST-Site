import {Dispatch, Key, SetStateAction} from "react";
import {App, Button, Space, Tooltip} from "antd";
import {moveOrCopyFilesAction} from "@/shared/services/file-manager-service/actions/actions";
import {CloseSquareOutlined, CopyOutlined, ImportOutlined, ScissorOutlined} from "@ant-design/icons";
import {useServerAction} from "@/shared/hooks/use-server-action";

interface IProps {
  currentPath: string;
  selectedRowKeys: Key[];
  setSelectedRowKeys: Dispatch<SetStateAction<Key[]>>;
  filesInMemory: string[];
  setFilesInMemory: Dispatch<SetStateAction<string[]>>;
  filesInMemoryCut: boolean;
  setFilesInMemoryCut: Dispatch<SetStateAction<boolean>>;
  setUpdateFiles: Dispatch<SetStateAction<number>>;
}

export default function CopyCutPasteButtons(props: IProps) {
  const {notification} = App.useApp();

  const pasteFromMemory = () => {
    useServerAction(moveOrCopyFilesAction(props.currentPath, props.filesInMemory, props.filesInMemoryCut))
      .then(() => {
        notification.success({title: "Успішно файли вставлено"});
        props.setFilesInMemory(() => []);
        setTimeout(() => {
          props.setUpdateFiles((prevState) => prevState + 1)
        }, 500)
      })
      .catch((error) => {
        notification.error({title: "Помилка встааляння файлів", description: error.message});
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
      <Tooltip title="Копіювати вибрані файли">
        <Button
          icon={<CopyOutlined/>}
          onClick={() => copyOrCut(false)}
          disabled={props.selectedRowKeys.length == 0}
        >
          Копіювати
        </Button>
      </Tooltip>
      <Tooltip title="Вирізати вибрані файли">
        <Button
          icon={<ScissorOutlined/>}
          onClick={() => copyOrCut(true)}
          disabled={props.selectedRowKeys.length == 0}
        >
          Вирізати
        </Button>
      </Tooltip>
      {props.filesInMemory.length != 0 &&
        <Tooltip title={`Очистити список вирізаних/скопійованих файлів`}>
          <Button
            icon={<CloseSquareOutlined/>}
            onClick={clearMemory}
          >
            {`Забути ${props.filesInMemoryCut ? "вирізане" : "скопійоване"}`}
          </Button>
        </Tooltip>
      }
      {props.filesInMemory.length != 0 &&
        <Tooltip title={`Вставити вирізані/скопійовані файли`}>
          <Button
            icon={<ImportOutlined/>}
            onClick={pasteFromMemory}
          >
            Вставити
          </Button>
        </Tooltip>
      }
    </Space>
  )
}
