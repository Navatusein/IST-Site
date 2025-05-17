import {INews} from "@/entities/news";
import {DatePicker, Form, FormInstance, Image, Input} from "antd";
import {SelectFileButton} from "@/features/select-file-button";
import dayjs from "dayjs";

interface IProps {
  news: INews[];
}

export default function NewsCrudForm(props: IProps) {
  const validPath = (value: string, form: FormInstance<INews>) => {
    return new Promise((resolve, reject) => {
      if (props.news.find(x => (x._id != form.getFieldValue("_id") && x.path == value)) != null)
        reject("Шлях має бути унікальним");

      resolve("");
    });
  }

  return (
    <>
      <Form.Item<INews> hidden name="_id">
        <Input type="hidden"/>
      </Form.Item>
      <Form.Item<INews> hidden name="components">
        <Input type="hidden"/>
      </Form.Item>
      <Form.Item<INews>
        label="Заголовок"
        name="title"
        extra="Заголовок сторінки"
        style={{marginBottom: 0}}
        rules={[{required: true, message: "Введіть заголовок новини!"}]}
      >
        <Input.TextArea rows={2}/>
      </Form.Item>
      <Form.Item<INews>
        label="Опис"
        name="description"
        extra="Опис сторінки"
        style={{marginBottom: 0}}
        rules={[{required: true, message: "Введіть опис новини!"}]}
      >
        <Input.TextArea rows={5}/>
      </Form.Item>
      <Form.Item<INews>
        label="Шлях"
        name="path"
        style={{marginBottom: 0}}
        rules={[
          {
            required: true,
            message: "Введіть шлях сторінки!"
          },
          {
            pattern: /^([a-z0-9-]+)*$/,
            message: "Шлях повинен містити лише a-z, 0-9, '-'"
          },
          (form) => ({
            validator: (_, value) => validPath(value, form as FormInstance<INews>),
          })
        ]}
        extra="Шлях новини"
      >
        <Input/>
      </Form.Item>
      <Form.Item<INews>
        label="Дата"
        name="date"
        extra="Дата новини"
        style={{marginBottom: 0}}
        rules={[{required: true, message: "Введіть дату новини!"}]} // ({ value: new Date(value).toDateString() })
        getValueProps={(value) => {
          return {value: value == undefined ? undefined : dayjs(value)}
        }}

      >
        <DatePicker format='DD.MM.YYYY' placeholder='DD.MM.YYYY' style={{width: "100%"}}/>
      </Form.Item>
      <Form.Item<INews>
        label="Малюнок"
        name="imagePath"
        extra="Малюнок новини"
        style={{marginBottom: 0}}
      >
        <SelectFileButton filter={["image"]}/>
      </Form.Item>
    </>
  )
}
