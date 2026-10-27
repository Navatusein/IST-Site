import {INews} from "@/entities/news";
import {isNewsPathAvailableAction} from "@/entities/news/actions/actions";
import {unwrapServerAction} from "@/shared/utilities/unwrap-server-action";
import {DatePicker, Form, FormInstance, Input} from "antd";
import {SelectFileButton} from "@/entities/file/ui";
import dayjs from "dayjs";

export default function NewsCrudForm() {
  const validPath = async (value: string, form: FormInstance<INews>) => {
    if (!value)
      return;

    if (!await unwrapServerAction(isNewsPathAvailableAction(value, form.getFieldValue("_id"))))
      throw new Error("Шлях має бути унікальним");
  }

  return (
    <>
      <Form.Item<INews> hidden name="_id">
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
        validateDebounce={400}
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
        extra="Адреса новини на сайті; після зміни стара адреса перенаправлятиме на нову"
      >
        <Input/>
      </Form.Item>
      <Form.Item<INews>
        label="Дата"
        name="date"
        extra="Дата новини"
        style={{marginBottom: 0}}
        rules={[{required: true, message: "Введіть дату новини!"}]} // ({value: new Date(value).toDateString()})
        getValueProps={(value) => {
          return {value: value == undefined ? undefined : dayjs(value)}
        }}

      >
        <DatePicker format="DD.MM.YYYY" placeholder="DD.MM.YYYY" style={{width: "100%"}}/>
      </Form.Item>
      <Form.Item<INews>
        label="Малюнок"
        name="imageSlug"
        extra="Малюнок новини"
        style={{marginBottom: 0}}
      >
        <SelectFileButton filter={["image"]}/>
      </Form.Item>
    </>
  )
}
