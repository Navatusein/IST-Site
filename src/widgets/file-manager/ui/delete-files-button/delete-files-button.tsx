"use client"

import {App, Button, Tooltip} from "antd";
import {useContext} from "react";
import {DeleteOutlined} from "@ant-design/icons";
import {deleteFileEntriesAction} from "@/entities/file/actions/actions";
import {FileExplorerContext} from "@/entities/file/ui";
import {unwrapServerAction} from "@/shared/utilities/unwrap-server-action";

export default function DeleteFilesButton() {
  const {modal, notification} = App.useApp();
  const {selectedEntries, setSelectedEntries, setUpdateFiles} = useContext(FileExplorerContext);

  const deleteFiles = () => {
    modal.confirm({
      title: "Видалити файли",
      content: "Ви впевнені що хочете видалити ці файли? Посилання на них на сторінках сайту перестануть працювати.",
      okText: "Так",
      cancelText: "Ні",
      onOk: () => {
        unwrapServerAction(deleteFileEntriesAction(selectedEntries.map((x) => x.slug)))
          .then(() => {
            notification.success({title: "Файли видалено успішно",});
            setSelectedEntries(() => []);
            setUpdateFiles((prevState) => prevState + 1);
          })
          .catch((error) => {
            notification.error({title: "Помилка видалення файлів", description: error.message});
          });
      }
    });
  }

  return (
    <Tooltip title="Видалити вибрані файли">
      <Button
        icon={<DeleteOutlined/>}
        danger
        onClick={deleteFiles}
        disabled={selectedEntries.length == 0}
      >
        Видалити
      </Button>
    </Tooltip>
  )
}
