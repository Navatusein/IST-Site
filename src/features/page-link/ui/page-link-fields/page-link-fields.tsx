"use client"

import {Form, Input, Select} from "antd";
import {SelectFileButton} from "@/entities/file/ui";
import {PageLinkType} from "../../types/type";

interface IProps {
  name: (string | number)[];
  fullName: (string | number)[];
  required?: boolean;
  allowNone?: boolean;
}

export default function PageLinkFields(props: IProps) {
  const form = Form.useFormInstance();
  const linkType = Form.useWatch<PageLinkType>([...props.fullName, "linkType"]);
  const required = props.required ?? true;

  const getLinkTypeFromEvent = (value: PageLinkType) => {
    if (value != form.getFieldValue([...props.fullName, "linkType"]))
      form.setFieldValue([...props.fullName, "link"], "");

    return value;
  }

  return (
    <>
      <Form.Item
        name={[...props.name, "linkType"]}
        label="Посилання на"
        style={{marginBottom: 0}}
        getValueFromEvent={getLinkTypeFromEvent}
      >
        <Select
          options={[
            ...(props.allowNone ? [{label: "Немає", value: "none"}] : []),
            {label: "Сайт", value: "link"},
            {label: "Файл", value: "file"},
            {label: "Сторінку нашого сайту", value: "page"},
          ]}
        />
      </Form.Item>
      {linkType == "none" ? null : linkType == "file" ? (
        <Form.Item
          name={[...props.name, "link"]}
          label="Файл"
          style={{marginBottom: 0}}
          rules={[{required, message: "Виберіть файл"}]}
        >
          <SelectFileButton/>
        </Form.Item>
      ) : linkType == "page" ? (
        <Form.Item
          name={[...props.name, "link"]}
          label="Шлях сторінки"
          style={{marginBottom: 0}}
          rules={[
            {required, whitespace: true, message: "Введіть шлях сторінки"},
            {pattern: /^\/(?![\/\\])/, message: "Шлях має починатися з /"},
          ]}
        >
          <Input placeholder="/about"/>
        </Form.Item>
      ) : (
        <Form.Item
          name={[...props.name, "link"]}
          label="Адреса"
          style={{marginBottom: 0}}
          rules={[
            {required, whitespace: true, message: "Введіть адресу"},
            {pattern: /^(https?:\/\/|mailto:|tel:)/i, message: "Адреса має починатися з https://, mailto: або tel:"},
          ]}
        >
          <Input placeholder="https://"/>
        </Form.Item>
      )}
    </>
  )
}
