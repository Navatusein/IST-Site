import {useContext, useState} from "react";
import {App, Button, Flex, Tag, Tooltip, Typography} from "antd";
import {CloseOutlined, CopyOutlined, ImportOutlined, ScissorOutlined} from "@ant-design/icons";
import {IFileEntry} from "@/entities/file";
import {moveOrCopyFileEntriesAction} from "@/entities/file/actions/actions";
import {FileExplorerContext} from "@/entities/file/ui";
import {unwrapServerAction} from "@/shared/utilities/unwrap-server-action";
import {ActionBar} from "@/shared/ui-kit";

interface IProps {
  entries: IFileEntry[];
  isCut: boolean;
  onClear: () => void;
}

const SHOWN_NAMES = 3;

export default function ClipboardBar(props: IProps) {
  const {notification} = App.useApp();
  const {currentFolder, setUpdateFiles} = useContext(FileExplorerContext);

  const [isPasting, setIsPasting] = useState<boolean>(false);

  const paste = () => {
    setIsPasting(() => true);

    unwrapServerAction(moveOrCopyFileEntriesAction(currentFolder, props.entries.map((entry) => entry.slug), props.isCut))
      .then(() => {
        notification.success({title: props.isCut ? "Переміщено в цю папку" : "Скопійовано в цю папку"});
        props.onClear();
        setUpdateFiles((value) => value + 1);
      })
      .catch((error) => notification.error({title: "Помилка вставлення", description: error.message}))
      .finally(() => setIsPasting(() => false));
  }

  const hidden = props.entries.length - SHOWN_NAMES;

  return (
    <ActionBar color="warning">
      {props.isCut ? <ScissorOutlined/> : <CopyOutlined/>}
      <Typography.Text strong>
        {props.isCut ? "Вирізано" : "Скопійовано"}: {props.entries.length}
      </Typography.Text>
      <Flex gap={4} wrap style={{flex: "1 1 200px", minWidth: 0}}>
        {props.entries.slice(0, SHOWN_NAMES).map((entry) => (
          <Tag key={entry.slug} style={{marginInlineEnd: 0, maxWidth: 220, overflow: "hidden", textOverflow: "ellipsis"}}>
            {entry.name}
          </Tag>
        ))}
        {hidden > 0 && <Tag style={{marginInlineEnd: 0}}>ще {hidden}</Tag>}
      </Flex>
      <Tooltip title={props.isCut ? "Перемістити в поточну папку" : "Скопіювати в поточну папку"}>
        <Button type="primary" icon={<ImportOutlined/>} loading={isPasting} onClick={paste}>Вставити сюди</Button>
      </Tooltip>
      <Tooltip title={props.isCut ? "Не переміщувати" : "Не копіювати"}>
        <Button type="text" icon={<CloseOutlined/>} onClick={props.onClear} aria-label="Скасувати"/>
      </Tooltip>
    </ActionBar>
  )
}
