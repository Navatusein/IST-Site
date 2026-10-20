import {App, Button, Input, InputRef, Tooltip} from "antd";
import {useContext, useRef} from "react";
import {FormOutlined} from "@ant-design/icons";
import {renameFileEntryAction} from "@/entities/file/actions/actions";
import {FileExplorerContext} from "@/entities/file/ui";
import {unwrapServerAction} from "@/shared/utilities/unwrap-server-action";

export default function RenameButton() {
  const {notification, modal} = App.useApp();
  const {selectedEntries, setSelectedEntries, setUpdateFiles} = useContext(FileExplorerContext);

  const newNameInput = useRef<InputRef>(null);

  const rename = () => {
    const newName = newNameInput.current?.input?.value.trim() ?? "";

    unwrapServerAction(renameFileEntryAction(selectedEntries[0].slug, newName))
      .then(() => {
        notification.success({title: "Успішне перейменування"});
        setSelectedEntries(() => []);
        setUpdateFiles((prevState) => prevState + 1);
      })
      .catch((error) => {
        notification.error({title: "Помилка перейменування", description: error.message});
      });
  }

  const onChange = (text: string, update: (configUpdate: any) => void) => {
    update({
      okButtonProps: {disabled: text.trim().length === 0},
    });
  }

  const openRenameModal = () => {
    const modalInstance = modal.confirm({
      title: "Введіть нову назву",
      content:
        <Input
          defaultValue={selectedEntries[0].name}
          ref={newNameInput}
          onChange={(e) => onChange(e.target.value, modalInstance.update)}
        />,
      okButtonProps: {disabled: true},
      okText: "Перейменувати",
      cancelText: "Відмінити",
      onOk: () => rename()
    });
  }

  return (
    <Tooltip title="Перейменувати вибраний файл">
      <Button icon={<FormOutlined/>} onClick={openRenameModal} disabled={selectedEntries.length != 1}>
        Перейменувати
      </Button>
    </Tooltip>
  )
}
