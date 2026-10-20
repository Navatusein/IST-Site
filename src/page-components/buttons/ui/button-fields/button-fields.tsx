import {Form, FormListFieldData, Input} from "antd";
import {PageLinkFields} from "@/features/page-link";

interface IProps {
  field: FormListFieldData;
}

export default function ButtonFields(props: IProps) {
  return (
    <>
      <Form.Item
        name={[props.field.name, "title"]}
        label="Текст"
        style={{marginBottom: 0}}
        rules={[{required: true, whitespace: true, message: "Введіть текст кнопки"}]}
      >
        <Input/>
      </Form.Item>
      <PageLinkFields name={[props.field.name]} fullName={["buttons", props.field.name]}/>
    </>
  )
}
