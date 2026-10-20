import {useContext, useEffect, useRef, useState} from "react";
import {App, Flex, Form, Input, InputRef, Modal, Typography} from "antd";
import {FileOutlined, FolderAddOutlined, FolderOutlined} from "@ant-design/icons";
import type {IFileEntry} from "@/entities/file";
import {createDirectoryAction, renameFileEntryAction} from "@/entities/file/actions/actions";
import {FileExplorerContext} from "@/entities/file/ui";
import {unwrapServerAction} from "@/shared/utilities/unwrap-server-action";

export type EntryNameModalState = {mode: "create"} | {mode: "rename", entry: IFileEntry} | null;

interface IProps {
  state: EntryNameModalState;
  onClose: () => void;
}

interface IFormData {
  name: string;
}

const FORBIDDEN_CHARACTERS = /[\\/]/;

export default function EntryNameModal(props: IProps) {
  const {message} = App.useApp();
  const {currentFolder, setSelectedEntries, setUpdateFiles} = useContext(FileExplorerContext);
  const [form] = Form.useForm<IFormData>();
  const inputRef = useRef<InputRef>(null);

  const [isSaving, setIsSaving] = useState<boolean>(false);

  const state = props.state;
  const isRename = state?.mode == "rename";
  const entry = isRename ? state.entry : null;

  useEffect(() => {
    if (!state)
      return;

    form.resetFields();
    form.setFieldsValue({name: entry?.name ?? ""});

    const timer = setTimeout(() => {
      const input = inputRef.current?.input;
      input?.focus();

      if (input && entry) {
        const dot = entry.kind == "file" ? entry.name.lastIndexOf(".") : -1;
        input.setSelectionRange(0, dot > 0 ? dot : entry.name.length);
      }
    }, 50);

    return () => clearTimeout(timer);
  }, [state]);

  const submit = ({name}: IFormData) => {
    if (isSaving)
      return;

    const value = name.trim();

    if (entry && value == entry.name)
      return props.onClose();

    setIsSaving(() => true);

    const request = entry ? renameFileEntryAction(entry.slug, value) : createDirectoryAction(currentFolder, value);

    unwrapServerAction(request)
      .then(() => {
        message.success(entry ? "Перейменовано" : "Папку створено");
        setSelectedEntries(() => []);
        setUpdateFiles((count) => count + 1);
        props.onClose();
      })
      .catch((error) => form.setFields([{name: "name", errors: [error.message]}]))
      .finally(() => setIsSaving(() => false));
  }

  const icon = !entry ? <FolderAddOutlined/> : entry.kind == "directory" ? <FolderOutlined/> : <FileOutlined/>;

  return (
    <Modal
      open={state != null}
      title={(
        <Flex align="center" gap="small" style={{minWidth: 0}}>
          {icon}
          <Typography.Text strong ellipsis style={{fontSize: "inherit"}}>
            {entry ? `Перейменувати «${entry.name}»` : "Нова папка"}
          </Typography.Text>
        </Flex>
      )}
      okText={entry ? "Перейменувати" : "Створити"}
      cancelText="Відмінити"
      onOk={() => form.submit()}
      onCancel={props.onClose}
      confirmLoading={isSaving}
      destroyOnHidden
      width={440}
    >
      <Form<IFormData> form={form} layout="vertical" onFinish={submit} requiredMark={false} style={{marginTop: 16}}>
        <Form.Item<IFormData>
          label="Назва"
          name="name"
          style={{marginBottom: 0}}
          rules={[
            {required: true, whitespace: true, message: "Вкажіть назву"},
            {max: 255, message: "Не більше 255 символів"},
            {
              validator: (_, value?: string) => value && FORBIDDEN_CHARACTERS.test(value) ?
                Promise.reject(new Error("Назва не може містити / або \\")) :
                Promise.resolve()
            }
          ]}
        >
          <Input
            ref={inputRef}
            placeholder={entry ? undefined : "Наприклад, Документи"}
            autoComplete="off"
            maxLength={255}
            onPressEnter={(event) => {
              event.preventDefault();
              form.submit();
            }}
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}
