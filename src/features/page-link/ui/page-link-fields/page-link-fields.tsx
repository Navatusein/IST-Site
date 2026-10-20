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

  const onLinkTypeChange = () => {
    form.setFieldValue([...props.fullName, "link"], "");
  }

  return (
    <>
      <Form.Item name={[...props.name, "linkType"]} label="Посилання на" style={{marginBottom: 0}}>
        <Select
          onChange={onLinkTypeChange}
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
      ) : (
        <Form.Item
          name={[...props.name, "link"]}
          label={linkType == "page" ? "Шлях сторінки" : "Адреса"}
          style={{marginBottom: 0}}
          rules={[{required, whitespace: true, message: linkType == "page" ? "Введіть шлях сторінки" : "Введіть адресу"}]}
        >
          <Input placeholder={linkType == "page" ? "/about" : "https://"}/>
        </Form.Item>
      )}
    </>
  )
}
