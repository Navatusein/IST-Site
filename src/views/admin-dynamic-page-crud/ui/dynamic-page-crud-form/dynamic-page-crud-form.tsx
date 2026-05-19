import {Form, FormInstance, Input} from "antd";
import {IDynamicPage} from "@/entities/dynamic-page";

interface IProps {
  pages: IDynamicPage[]
}

export default function DynamicPageCrudForm(props: IProps) {
  const validPath = (value: string, form: FormInstance<IDynamicPage>) => {
    return new Promise((resolve, reject) => {
      if (value.startsWith("admin"))
        reject("Шлях не може починатись з \"admin\"");

      if (value.startsWith("api"))
        reject("Шлях не може починатись з \"api\"");

      if (props.pages.find(x => (x._id != form.getFieldValue("_id") && x.path == value)) != null)
        reject("Шлях має бути унікальним");

      resolve("");
    });
  }

  return (
    <>
      <Form.Item<IDynamicPage> hidden name="_id">
        <Input type="hidden"/>
      </Form.Item>
      <Form.Item<IDynamicPage> hidden name="components">
        <Input type="hidden"/>
      </Form.Item>
      <Form.Item<IDynamicPage>
        label="Назва"
        name="name"
        extra="Внутрішня назва сторінки"
        style={{marginBottom: 0}}
        rules={[{required: true, message: "Введіть назву сторінки!"}]}
      >
        <Input/>
      </Form.Item>
      <Form.Item<IDynamicPage>
        label="Заголовок"
        name="title"
        extra="Заголовок сторінки"
        style={{marginBottom: 0}}
        rules={[{required: true, message: "Введіть заголовок сторінки!"}]}
      >
        <Input/>
      </Form.Item>
      <Form.Item<IDynamicPage>
        label="Шлях"
        name="path"
        style={{marginBottom: 0}}
        rules={[
          {
            required: true,
            message: "Введіть шлях сторінки!"
          },
          {
            pattern: /^([a-z0-9-]+\/)*[a-z0-9-]+$/,
            message: "Шлях повинен містити лише a-z, 0-9, '-', та '/' між частинами (не на початку або в кінці)"
          },
          (form) => ({
            validator: (_, value) => validPath(value, form as FormInstance<IDynamicPage>),
          })
        ]}
        extra="Шлях сторінки"
      >
        <Input/>
      </Form.Item>
    </>
  )
}
