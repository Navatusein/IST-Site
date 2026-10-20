import {Dispatch, SetStateAction, useContext} from "react";
import {App, Button, Space, Tooltip} from "antd";
import {CloseSquareOutlined, CopyOutlined, ImportOutlined, ScissorOutlined} from "@ant-design/icons";
import {IFileEntry} from "@/entities/file";
import {moveOrCopyFileEntriesAction} from "@/entities/file/actions/actions";
import {FileExplorerContext} from "@/entities/file/ui";
import {unwrapServerAction} from "@/shared/utilities/unwrap-server-action";

interface IProps {
  entriesInMemory: IFileEntry[];
  setEntriesInMemory: Dispatch<SetStateAction<IFileEntry[]>>;
  entriesInMemoryCut: boolean;
  setEntriesInMemoryCut: Dispatch<SetStateAction<boolean>>;
}

export default function CopyCutPasteButtons(props: IProps) {
  const {notification} = App.useApp();
  const {
    currentFolder,
    selectedEntries,
    setSelectedEntries,
    setUpdateFiles,
  } = useContext(FileExplorerContext);

  const pasteFromMemory = () => {
    const slugs = props.entriesInMemory.map((x) => x.slug);

    unwrapServerAction(moveOrCopyFileEntriesAction(currentFolder, slugs, props.entriesInMemoryCut))
      .then(() => {
        notification.success({title: "Успішно файли вставлено"});
        props.setEntriesInMemory(() => []);
        setUpdateFiles((prevState) => prevState + 1);
      })
      .catch((error) => {
        notification.error({title: "Помилка вставлення файлів", description: error.message});
      });
  }

  const copyOrCut = (cut: boolean) => {
    props.setEntriesInMemory(() => selectedEntries);
    props.setEntriesInMemoryCut(() => cut);
    setSelectedEntries(() => []);
  }

  const clearMemory = () => {
    props.setEntriesInMemory(() => []);
    props.setEntriesInMemoryCut(() => false);
    setSelectedEntries(() => []);
  }

  return (
    <Space wrap>
      <Tooltip title="Копіювати вибрані файли">
        <Button
          icon={<CopyOutlined/>}
          onClick={() => copyOrCut(false)}
          disabled={selectedEntries.length == 0}
        >
          Копіювати
        </Button>
      </Tooltip>
      <Tooltip title="Вирізати вибрані файли">
        <Button
          icon={<ScissorOutlined/>}
          onClick={() => copyOrCut(true)}
          disabled={selectedEntries.length == 0}
        >
          Вирізати
        </Button>
      </Tooltip>
      {props.entriesInMemory.length != 0 && (
        <Tooltip title={`Очистити список вирізаних/скопійованих файлів`}>
          <Button
            icon={<CloseSquareOutlined/>}
            onClick={clearMemory}
          >
            {`Забути ${props.entriesInMemoryCut ? "вирізане" : "скопійоване"}`}
          </Button>
        </Tooltip>
      )}
      {props.entriesInMemory.length != 0 && (
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
