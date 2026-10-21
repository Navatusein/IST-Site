import {Form, FormInstance, Input} from "antd";
import {isDynamicPagePathAvailableAction} from "@/entities/dynamic-page/actions/actions";
import {unwrapServerAction} from "@/shared/utilities/unwrap-server-action";
import {IDynamicPage} from "@/entities/dynamic-page";

const RESERVED_PATH_SEGMENTS = ["admin", "api", "news", "department-staff", "file", "files", "sign-in", "not-found", "test", "_next"];

export default function DynamicPageCrudForm() {
  const validPath = async (value: string, form: FormInstance<IDynamicPage>) => {
    if (!value)
      return;

    const firstSegment = value.split("/")[0];

    if (RESERVED_PATH_SEGMENTS.includes(firstSegment))
      throw new Error(`Шлях не може починатись з "${firstSegment}": цю адресу займає інший розділ сайту`);

    if (!await unwrapServerAction(isDynamicPagePathAvailableAction(value, form.getFieldValue("_id"))))
      throw new Error("Шлях має бути унікальним");
  }

  return (
    <>
      <Form.Item<IDynamicPage> hidden name="_id">
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
        extra="Назва вкладки браузера та результату в пошуку"
        style={{marginBottom: 0}}
        rules={[{required: true, message: "Введіть заголовок сторінки!"}]}
      >
        <Input/>
      </Form.Item>
      <Form.Item<IDynamicPage>
        label="Опис"
        name="description"
        extra="Текст під заголовком у пошуку, до 300 символів. Якщо не вказано, береться початок першого текстового блоку"
        style={{marginBottom: 0}}
        rules={[{max: 300, message: "Не більше 300 символів"}]}
      >
        <Input.TextArea autoSize={{minRows: 2, maxRows: 5}} maxLength={300}/>
      </Form.Item>
      <Form.Item<IDynamicPage>
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
