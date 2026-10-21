import {IDepartmentStaff} from "@/entities/department-staff";
import type {IDepartmentStaffProfile} from "@/entities/department-staff/types/type";
import {isDepartmentStaffPathAvailableAction} from "@/entities/department-staff/actions/actions";
import {unwrapServerAction} from "@/shared/utilities/unwrap-server-action";
import {Form, FormInstance, Input, Tabs, TabsProps} from "antd";
import {SelectFileButton} from "@/entities/file/ui";
import {FormSortableList} from "@/shared/ui-kit";

export default function DepartmentStaffCrudForm() {
  const validPath = async (value: string, form: FormInstance<IDepartmentStaff>) => {
    if (!value)
      return;

    if (!await unwrapServerAction(isDepartmentStaffPathAvailableAction(value, form.getFieldValue("_id"))))
      throw new Error("Шлях має бути унікальним");
  }

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "Загальні налаштування",
      forceRender: true,
      children: (
        <>
          <Form.Item<IDepartmentStaff> hidden name="_id">
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
            name="imageSlug"
            extra="Фотографія викладача"
            style={{marginBottom: 0}}
          >
            <SelectFileButton filter={["image"]}/>
          </Form.Item>
          <Form.Item<IDepartmentStaff>
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
      key: "2",
      label: "Профілі",
      forceRender: true,
      children: (
        <Form.List name="profiles">
          {(fields, operations) => (
            <FormSortableList<IDepartmentStaffProfile>
              listName="profiles"
              fields={fields}
              operations={operations}
              getTitle={(profile, index) => profile?.title?.trim() || `Профіль ${index + 1}`}
              renderFields={(field) => (
                <>
                  <Form.Item
                    name={[field.name, "title"]}
                    label="Назва"
                    style={{marginBottom: 0}}
                    extra="Наприклад: Google Scholar, ORCID, Scopus"
                    rules={[{required: true, whitespace: true, message: "Введіть назву профілю", warningOnly: true}]}
                  >
                    <Input/>
                  </Form.Item>
                  <Form.Item
                    name={[field.name, "url"]}
                    label="Посилання"
                    style={{marginBottom: 0}}
                    rules={[
                      {required: true, whitespace: true, message: "Введіть посилання на профіль", warningOnly: true},
                      {type: "url", message: "Введіть повну адресу, що починається з https://", warningOnly: true}
                    ]}
                  >
                    <Input placeholder="https://"/>
                  </Form.Item>
                </>
              )}
              addLabel="Додати профіль"
              createItem={() => ({title: "", url: ""})}
            />
          )}
        </Form.List>
      ),
    }
  ];

  return (
    <>
      <Tabs defaultActiveKey="1" items={items} style={{width: "100%", marginTop: "-24px"}}/>
    </>
  )
}
