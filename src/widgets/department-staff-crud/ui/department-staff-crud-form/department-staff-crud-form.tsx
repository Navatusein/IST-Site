import {IDepartmentStaff} from "@/entities/department-staff";
import {Button, Card, Flex, Form, FormInstance, Input, Tabs, TabsProps} from "antd";
import {SelectFileButton} from "@/features/select-file-button";
import {PlusOutlined} from "@ant-design/icons";

interface IProps {
  teachers: IDepartmentStaff[];
}

export default function DepartmentStaffCrudForm(props: IProps) {
  const validPath = (value: string, form: FormInstance<IDepartmentStaff>) => {
    return new Promise((resolve, reject) => {
      if (props.teachers.find(x => (x._id != form.getFieldValue("_id") && x.path == value)) != null)
        reject("Шлях має бути унікальним");

      resolve("");
    });
  }

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: 'Загалні налаштування',
      children: (
        <>
          <Form.Item<IDepartmentStaff> hidden name="_id">
            <Input type="hidden"/>
          </Form.Item>
          <Form.Item<IDepartmentStaff> hidden name="components">
            <Input type="hidden"/>
          </Form.Item>
          <Form.Item<IDepartmentStaff>
            label="Фамілія"
            name="lastName"
            extra="Фамілія викладача"
            style={{marginBottom: 0}}
            rules={[{required: true, message: "Введіть фамілію викладача!"}]}
          >
            <Input/>
          </Form.Item>
          <Form.Item<IDepartmentStaff>
            label="Ім'я"
            name="firstName"
            extra="Ім'я викладача"
            style={{marginBottom: 0}}
            rules={[{required: true, message: "Введіть ім'я викладача!"}]}
          >
            <Input/>
          </Form.Item>
          <Form.Item<IDepartmentStaff>
            label="Ім'я по батькові"
            name="middleName"
            extra="Ім'я по батькові викладача"
            style={{marginBottom: 0}}
            rules={[{required: true, message: "Введіть ім'я по батькові викладача!"}]}
          >
            <Input/>
          </Form.Item>
          <Form.Item<IDepartmentStaff>
            label="Посада"
            name="position"
            extra="Посада викладача"
            style={{marginBottom: 0}}
            rules={[{required: true, message: "Введіть посаду викладача!"}]}
          >
            <Input/>
          </Form.Item>
          <Form.Item<IDepartmentStaff>
            label="Пошта"
            name="email"
            extra="Пошта викладача"
            style={{marginBottom: 0}}
            rules={[{required: true, message: "Введіть пошту викладача!"}]}
          >
            <Input/>
          </Form.Item>
          <Form.Item<IDepartmentStaff>
            label="Фотографія"
            name="imagePath"
            extra="Фотографія викладача"
            style={{marginBottom: 0}}
          >
            <SelectFileButton filter={["image"]}/>
          </Form.Item>
          <Form.Item<IDepartmentStaff>
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
                validator: (_, value) => validPath(value, form as FormInstance<IDepartmentStaff>),
              })
            ]}
            extra="Шлях сторінки викладача"
          >
            <Input/>
          </Form.Item>
        </>
      ),
    },
    {
      key: '2',
      label: 'Профілі',
      children: (
        <Flex vertical gap="small">
          <Form.List name="profiles">
            {(fields, operations) =>
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Card key={key} size="small">
                    <Flex vertical gap="small">
                      <Form.Item
                        {...restField}
                        name={[name, "title"]}
                        label="Назва"
                        style={{marginBottom: 0}}
                        extra="Назва профілю"
                      >
                        <Input/>
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, "url"]}
                        label="Посилання"
                        style={{marginBottom: 0}}
                        extra="Послилання на профіль"
                      >
                        <Input.TextArea rows={2}/>
                      </Form.Item>
                      <Button onClick={() => operations.remove(name)} danger>
                        Видалити
                      </Button>
                    </Flex>
                  </Card>
                ))}
                  <Form.Item style={{marginBottom: 0}}>
                    <Button type="dashed" onClick={() => operations.add()} block icon={<PlusOutlined/>}>
                      Додати профіль
                    </Button>
                  </Form.Item>
              </>
            }
          </Form.List>
        </Flex>
      ),
    }
  ];

  return (
    <>
      <Tabs defaultActiveKey="1" items={items} style={{width: "100%", marginTop: "-24px"}}/>
    </>
  )
}
