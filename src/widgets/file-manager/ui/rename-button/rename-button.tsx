import {App, Button, Input, InputRef, Tooltip} from "antd";
import {Dispatch, Key, SetStateAction, useRef} from "react";
import {renameAction} from "@/shared/services/file-manager-service/actions/actions";
import {FormOutlined} from "@ant-design/icons";
import {useServerAction} from "@/shared/hooks/use-server-action";

interface IProps {
  selectedRowKeys: Key[],
  setSelectedRowKeys: Dispatch<SetStateAction<Key[]>>
  setUpdateFiles: Dispatch<SetStateAction<number>>
}

export default function RenameButton(props: IProps) {
  const {notification, modal} = App.useApp();

  const newNameInput = useRef<InputRef>(null);

  const createFolder = () => {
    const newName = newNameInput.current?.input?.value.trim() ?? "";

    useServerAction(renameAction(props.selectedRowKeys[0] as string, newName))
      .then(() => {
        notification.success({message: "Успішне перейменування"});
        props.setSelectedRowKeys(() => []);
        setTimeout(() => {
          props.setUpdateFiles((prevState) => prevState + 1);
        }, 500);
      })
      .catch((error) => {
        notification.error({message: "Помилка перейменування", description: error.message});
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
          defaultValue={(props.selectedRowKeys[0] as string).split("/").pop()}
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
      <Button icon={<FormOutlined/>} onClick={openRenameModal} disabled={props.selectedRowKeys.length != 1}>
        Перейменувати
      </Button>
    </Tooltip>
  )
}
