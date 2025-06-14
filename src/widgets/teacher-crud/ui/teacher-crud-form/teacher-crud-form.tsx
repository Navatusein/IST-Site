import {ITeacher} from "@/entities/teacher";
import {Form, FormInstance, Input} from "antd";
import {SelectFileButton} from "@/features/select-file-button";

interface IProps {
  teachers: ITeacher[];
}

export default function TeacherCrudForm(props: IProps) {
  const validPath = (value: string, form: FormInstance<ITeacher>) => {
    return new Promise((resolve, reject) => {
      if (props.teachers.find(x => (x._id != form.getFieldValue("_id") && x.path == value)) != null)
        reject("Шлях має бути унікальним");

      resolve("");
    });
  }

  return (
    <>
      <Form.Item<ITeacher> hidden name="_id">
        <Input type="hidden"/>
      </Form.Item>
      <Form.Item<ITeacher> hidden name="components">
        <Input type="hidden"/>
      </Form.Item>
      <Form.Item<ITeacher>
        label="Фамілія"
        name="lastName"
        extra="Фамілія викладача"
        style={{marginBottom: 0}}
        rules={[{required: true, message: "Введіть фамілію викладача!"}]}
      >
        <Input/>
      </Form.Item>
      <Form.Item<ITeacher>
        label="Ім'я"
        name="firstName"
        extra="Ім'я викладача"
        style={{marginBottom: 0}}
        rules={[{required: true, message: "Введіть ім'я викладача!"}]}
      >
        <Input/>
      </Form.Item>
      <Form.Item<ITeacher>
        label="Ім'я по батькові"
        name="middleName"
        extra="Ім'я по батькові викладача"
        style={{marginBottom: 0}}
        rules={[{required: true, message: "Введіть ім'я по батькові викладача!"}]}
      >
        <Input/>
      </Form.Item>
      <Form.Item<ITeacher>
        label="Посада"
        name="position"
        extra="Посада викладача"
        style={{marginBottom: 0}}
        rules={[{required: true, message: "Введіть посаду викладача!"}]}
      >
        <Input/>
      </Form.Item>
      <Form.Item<ITeacher>
        label="Пошта"
        name="email"
        extra="Пошта викладача"
        style={{marginBottom: 0}}
        rules={[{required: true, message: "Введіть пошту викладача!"}]}
      >
        <Input/>
      </Form.Item>
      <Form.Item<ITeacher>
        label="Фотографія"
        name="imagePath"
        extra="Фотографія викладача"
        style={{marginBottom: 0}}
      >
        <SelectFileButton filter={["image"]}/>
      </Form.Item>
      <Form.Item<ITeacher>
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
            validator: (_, value) => validPath(value, form as FormInstance<ITeacher>),
          })
        ]}
        extra="Шлях сторінки викладача"
      >
        <Input/>
      </Form.Item>
    </>
  )
}
