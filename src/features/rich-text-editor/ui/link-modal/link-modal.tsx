"use client"

import {useEffect, useRef, useState} from "react";
import {Editor} from "@tiptap/react";
import {Button, Checkbox, Flex, Form, Input, InputRef, Modal, Space, Typography} from "antd";
import {DisconnectOutlined, FileSearchOutlined, LinkOutlined} from "@ant-design/icons";
import {SelectFilesModal} from "@/entities/file/ui";
import {getFileViewUrl} from "@/shared/utilities/file-urls";

interface IProps {
  editor: Editor;
  open: boolean;
  onClose: () => void;
}

interface IFormData {
  href: string;
  text: string;
  newTab: boolean;
}

const VALID_HREF = /^(https?:\/\/\S+|mailto:\S+|tel:[\d+\-() ]+|\/(?![\/\\])\S*|#\S*)$/i;

const isExternal = (href: string) => /^https?:\/\//i.test(href);

export default function LinkModal(props: IProps) {
  const {editor} = props;
  const [form] = Form.useForm<IFormData>();
  const hrefInput = useRef<InputRef>(null);

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [selectedText, setSelectedText] = useState<string>("");
  const [isFileModalOpen, setIsFileModalOpen] = useState<boolean>(false);

  useEffect(() => {
    if (!props.open)
      return;

    const attributes = editor.getAttributes("link");
    const editing = editor.isActive("link");

    if (editing)
      editor.chain().extendMarkRange("link").run();

    const {from, to} = editor.state.selection;
    const text = editor.state.doc.textBetween(from, to, " ");

    setIsEditing(() => editing);
    setSelectedText(() => text);

    form.resetFields();
    form.setFieldsValue({
      href: attributes.href ?? "",
      text,
      newTab: editing ? attributes.target == "_blank" : true
    });

    const timer = setTimeout(() => hrefInput.current?.focus(), 50);
    return () => clearTimeout(timer);
  }, [props.open]);

  const submit = ({href, text, newTab}: IFormData) => {
    const url = href.trim();
    const target = newTab ? "_blank" : "_self";
    const label = text.trim() || url;

    if (selectedText && label == selectedText)
      editor.chain().focus().setLink({href: url, target}).run();
    else
      editor.chain().focus().insertContent({type: "text", text: label, marks: [{type: "link", attrs: {href: url, target}}]}).run();

    props.onClose();
  }

  const removeLink = () => {
    editor.chain().focus().extendMarkRange("link").unsetLink().run();
    props.onClose();
  }

  return (
    <>
      <Modal
        open={props.open}
        title={(
          <Space>
            <LinkOutlined/>
            {isEditing ? "Змінити посилання" : "Вставити посилання"}
          </Space>
        )}
        onCancel={props.onClose}
        destroyOnHidden
        width={480}
        footer={(
          <Flex justify="space-between" gap="small" wrap>
            <div>
              {isEditing && (
                <Button danger icon={<DisconnectOutlined/>} onClick={removeLink}>Видалити посилання</Button>
              )}
            </div>
            <Space>
              <Button onClick={props.onClose}>Відмінити</Button>
              <Button type="primary" onClick={() => form.submit()}>{isEditing ? "Зберегти" : "Вставити"}</Button>
            </Space>
          </Flex>
        )}
      >
        <Form<IFormData>
          form={form}
          layout="vertical"
          requiredMark={false}
          onFinish={submit}
          onValuesChange={(changed) => {
            if ("href" in changed && !isEditing)
              form.setFieldValue("newTab", isExternal(changed.href ?? ""));
          }}
          style={{marginTop: 16}}
        >
          <Form.Item<IFormData> label="Адреса" required style={{marginBottom: 16}}>
            <Space.Compact style={{width: "100%"}}>
              <Form.Item<IFormData>
                name="href"
                noStyle
                rules={[
                  {required: true, whitespace: true, message: "Вкажіть адресу"},
                  {pattern: VALID_HREF, message: "Адреса має починатися з https://, mailto:, tel: або / для сторінки сайту"}
                ]}
              >
                <Input
                  ref={hrefInput}
                  placeholder="https://… або /news"
                  autoComplete="off"
                  onPressEnter={(event) => {
                    event.preventDefault();
                    form.submit();
                  }}
                />
              </Form.Item>
              <Button icon={<FileSearchOutlined/>} onClick={() => setIsFileModalOpen(true)}>Файл</Button>
            </Space.Compact>
          </Form.Item>
          <Form.Item<IFormData>
            label="Текст посилання"
            name="text"
            style={{marginBottom: 16}}
            extra={selectedText ? "Виділений текст стане посиланням" : "Якщо не вказано, буде показано адресу"}
          >
            <Input
              autoComplete="off"
              onPressEnter={(event) => {
                event.preventDefault();
                form.submit();
              }}
            />
          </Form.Item>
          <Form.Item<IFormData> name="newTab" valuePropName="checked" style={{marginBottom: 0}}>
            <Checkbox>
              Відкривати в новій вкладці <Typography.Text type="secondary">(для інших сайтів)</Typography.Text>
            </Checkbox>
          </Form.Item>
        </Form>
      </Modal>
      <SelectFilesModal
        isOpen={isFileModalOpen}
        setIsOpen={setIsFileModalOpen}
        selectorType="radio"
        initialSelection={[]}
        onSubmit={(entries) => {
          const file = entries[0];

          if (!file)
            return;

          form.setFieldsValue({
            href: getFileViewUrl(file.slug),
            text: form.getFieldValue("text") || file.name,
            newTab: false
          });
          form.validateFields(["href"]);
        }}
      />
    </>
  )
}
