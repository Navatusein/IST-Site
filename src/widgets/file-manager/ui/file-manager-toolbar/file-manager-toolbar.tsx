import {useContext} from "react";
import {Button, Flex, theme, Tooltip, Typography, Upload} from "antd";
import {
  CloseOutlined,
  CloudDownloadOutlined,
  CopyOutlined,
  DeleteOutlined,
  ExportOutlined,
  FolderAddOutlined,
  FormOutlined,
  ImportOutlined,
  ReloadOutlined,
  ScissorOutlined
} from "@ant-design/icons";
import {IFileEntry} from "@/entities/file";
import {FileExplorerContext} from "@/entities/file/ui";
import {useFileActions} from "../../hooks/use-file-actions";
import {useFilesArchive} from "../../hooks/use-files-archive";
import {EntryNameModalContext} from "../../context/entry-name-modal-context";
import UploadFilesButton from "../upload-files-button/upload-files-button";
import {ActionBar} from "@/shared/ui-kit";
import {ACTION_BAR_HEIGHT} from "@/shared/ui-kit/action-bar/action-bar";

interface IProps {
  onCopy: (entries: IFileEntry[], isCut: boolean) => void;
}

export default function FileManagerToolbar(props: IProps) {
  const {token} = theme.useToken();
  const {selectedEntries, setSelectedEntries, setUpdateFiles} = useContext(FileExplorerContext);
  const {openCreateFolder} = useContext(EntryNameModalContext);
  const {rename, remove, download} = useFileActions();
  const {exportFiles, confirmImport, isImporting} = useFilesArchive();

  if (selectedEntries.length != 0) {
    const single = selectedEntries.length == 1 ? selectedEntries[0] : undefined;
    const isSingleFile = single?.kind == "file";

    return (
      <ActionBar>
        <Typography.Text strong style={{marginRight: token.paddingXS}}>Вибрано: {selectedEntries.length}</Typography.Text>
        <Tooltip title={isSingleFile ? "Скачати файл" : "Скачати одним ZIP-архівом"}>
          <Button
            icon={<CloudDownloadOutlined/>}
            onClick={() => {
              download(selectedEntries);
              setSelectedEntries(() => []);
            }}
          >
            Скачати
          </Button>
        </Tooltip>
        {single && <Button icon={<FormOutlined/>} onClick={() => rename(single)}>Перейменувати</Button>}
        <Button icon={<CopyOutlined/>} onClick={() => props.onCopy(selectedEntries, false)}>Копіювати</Button>
        <Button icon={<ScissorOutlined/>} onClick={() => props.onCopy(selectedEntries, true)}>Вирізати</Button>
        <Tooltip title="Експорт вибраного: ZIP, який можна імпортувати назад на ці ж місця">
          <Button icon={<ExportOutlined/>} onClick={() => exportFiles(selectedEntries)}>Експорт</Button>
        </Tooltip>
        <Button danger icon={<DeleteOutlined/>} onClick={() => remove(selectedEntries)}>Видалити</Button>
        <Tooltip title="Зняти виділення">
          <Button type="text" icon={<CloseOutlined/>} onClick={() => setSelectedEntries(() => [])} style={{marginLeft: "auto"}} aria-label="Зняти виділення"/>
        </Tooltip>
      </ActionBar>
    );
  }

  return (
    <Flex gap={token.paddingXS} align="center" wrap style={{minHeight: ACTION_BAR_HEIGHT}}>
      <UploadFilesButton/>
      <Tooltip title="Створити нову папку тут">
        <Button icon={<FolderAddOutlined/>} onClick={openCreateFolder}>Створити папку</Button>
      </Tooltip>
      <Flex gap={token.paddingXS} wrap style={{marginLeft: "auto"}}>
        <Tooltip title="Експорт усіх файлів: ZIP, який можна імпортувати назад на ці ж місця">
          <Button icon={<ExportOutlined/>} onClick={() => exportFiles([])}>Експорт</Button>
        </Tooltip>
        <Tooltip title="Імпортувати ZIP-архів у поточну папку або відновити експорт">
          <Upload accept=".zip,application/zip" showUploadList={false} beforeUpload={confirmImport}>
            <Button icon={<ImportOutlined/>} loading={isImporting}>Імпорт</Button>
          </Upload>
        </Tooltip>
        <Tooltip title="Оновити список">
          <Button icon={<ReloadOutlined/>} onClick={() => setUpdateFiles((value) => value + 1)} aria-label="Оновити список"/>
        </Tooltip>
      </Flex>
    </Flex>
  )
}
