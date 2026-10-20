import {Form, FormListFieldData, Input} from "antd";
import {PageLinkFields, PageLinkType} from "@/features/page-link";

interface IProps {
  field: FormListFieldData;
  defaultButtonText: string;
}

export default function LinkCardFields(props: IProps) {
  const linkType = Form.useWatch<PageLinkType>(["cards", props.field.name, "linkType"]);

  return (
    <>
      <Form.Item
        name={[props.field.name, "title"]}
        label="Назва"
        style={{marginBottom: 0}}
        rules={[{required: true, whitespace: true, message: "Введіть назву картки"}]}
      >
        <Input/>
      </Form.Item>
      <Form.Item name={[props.field.name, "description"]} label="Текст" style={{marginBottom: 0}}>
        <Input.TextArea autoSize={{minRows: 1, maxRows: 4}} placeholder="Наприклад: Затверджено 2025"/>
      </Form.Item>
      <PageLinkFields name={[props.field.name]} fullName={["cards", props.field.name]} required={false} allowNone/>
      {linkType != "none" && (
        <Form.Item
          name={[props.field.name, "buttonText"]}
          label="Текст кнопки"
          style={{marginBottom: 0}}
          extra="Поки посилання не вказане, кнопка неактивна"
        >
          <Input placeholder={props.defaultButtonText}/>
        </Form.Item>
      )}
    </>
  )
}
