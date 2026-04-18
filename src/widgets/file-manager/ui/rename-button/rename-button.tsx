import {App, Button, Input, InputRef, Tooltip} from "antd";
import {useContext, useRef} from "react";
import {renameAction} from "@/shared/services/file-manager-service/actions/actions";
import {FormOutlined} from "@ant-design/icons";
import {useServerAction} from "@/shared/hooks/use-server-action";
import {FileExplorerContext} from "@/shared/context/file-explorer-context/file-explorer-context";

interface IProps {}

export default function RenameButton(props: IProps) {
  const {notification, modal} = App.useApp();
  const {selectedRowKeys, setSelectedRowKeys, setUpdateFiles} = useContext(FileExplorerContext);

  const newNameInput = useRef<InputRef>(null);

  const createFolder = () => {
    const newName = newNameInput.current?.input?.value.trim() ?? "";

    useServerAction(renameAction(selectedRowKeys[0] as string, newName))
      .then(() => {
        notification.success({title: "Успішне перейменування"});
        setSelectedRowKeys(() => []);
        setTimeout(() => {
          setUpdateFiles((prevState) => prevState + 1);
        }, 500);
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
          defaultValue={(selectedRowKeys[0] as string).split("/").pop()}
          ref={newNameInput}
          onChange={(e) => onChange(e.target.value, modalInstance.update)}
        />,
      okButtonProps: {disabled: true},
      okText: "Перейменувати",
      cancelText: "Відмінити",
      onOk: () => createFolder()
    });
  }

  return (
    <Tooltip title="Перейменувати вибрані файли">
      <Button icon={<FormOutlined/>} onClick={openRenameModal} disabled={selectedRowKeys.length != 1}>
        Перейменувати
      </Button>
    </Tooltip>
  )
}
