import {Dispatch, SetStateAction, useContext} from "react";
import {App, Button, Space, Tooltip} from "antd";
import {moveOrCopyFilesAction} from "@/shared/services/file-manager-service/actions/actions";
import {CloseSquareOutlined, CopyOutlined, ImportOutlined, ScissorOutlined} from "@ant-design/icons";
import {useServerAction} from "@/shared/hooks/use-server-action";
import {FileExplorerContext} from "@/shared/context/file-explorer-context/file-explorer-context";

interface IProps {
  filesInMemory: string[];
  setFilesInMemory: Dispatch<SetStateAction<string[]>>;
  filesInMemoryCut: boolean;
  setFilesInMemoryCut: Dispatch<SetStateAction<boolean>>;
}

export default function CopyCutPasteButtons(props: IProps) {
  const {notification} = App.useApp();
  const {
    currentPath,
    selectedRowKeys,
    setSelectedRowKeys,
    setUpdateFiles,
  } = useContext(FileExplorerContext);

  const pasteFromMemory = () => {
    useServerAction(moveOrCopyFilesAction(currentPath, props.filesInMemory, props.filesInMemoryCut))
      .then(() => {
        notification.success({title: "Успішно файли вставлено"});
        props.setFilesInMemory(() => []);
        setTimeout(() => {
          setUpdateFiles((prevState) => prevState + 1)
        }, 500)
      })
      .catch((error) => {
        notification.error({title: "Помилка вставлення файлів", description: error.message});
      });
  }

  const copyOrCut = (cut: boolean) => {
    props.setFilesInMemory(() => selectedRowKeys as string[]);
    props.setFilesInMemoryCut(() => cut);
    setSelectedRowKeys(() => []);
  }

  const clearMemory = () => {
    props.setFilesInMemory(() => []);
    props.setFilesInMemoryCut(() => false);
    setSelectedRowKeys(() => []);
  }

  return (
    <Space wrap>
      <Tooltip title="Копіювати вибрані файли">
        <Button
          icon={<CopyOutlined/>}
          onClick={() => copyOrCut(false)}
          disabled={selectedRowKeys.length == 0}
        >
          Копіювати
        </Button>
      </Tooltip>
      <Tooltip title="Вирізати вибрані файли">
        <Button
          icon={<ScissorOutlined/>}
          onClick={() => copyOrCut(true)}
          disabled={selectedRowKeys.length == 0}
        >
          Вирізати
        </Button>
      </Tooltip>
      {props.filesInMemory.length != 0 && (
        <Tooltip title={`Очистити список вирізаних/скопійованих файлів`}>
          <Button
            icon={<CloseSquareOutlined/>}
            onClick={clearMemory}
          >
            {`Забути ${props.filesInMemoryCut ? "вирізане" : "скопійоване"}`}
          </Button>
        </Tooltip>
      )}
      {props.filesInMemory.length != 0 && (
        <Tooltip title={`Вставити вирізані/скопійовані файли`}>
          <Button
            icon={<ImportOutlined/>}
            onClick={pasteFromMemory}
          >
            Вставити
          </Button>
        </Tooltip>
      )}
    </Space>
  )
}
