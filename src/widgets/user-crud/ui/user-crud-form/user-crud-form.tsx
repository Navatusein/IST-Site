import {Form, Input, Select} from "antd";
import {IDynamicPage} from "@/entities/dynamic-page";
import {IUser, UserPermissionType} from "@/entities/user";

const PERMISSIONS_OPTIONS: {label: string, value: UserPermissionType}[] = [
  {label: "Редагувати новини", value: "edit-news"},
  {label: "Редагувати сторіник", value: "edit-dynamic-pages"},
  {label: "Редагувати меню", value: "edit-public-menu"},
  {label: "Редагувати співробітників", value: "edit-department-staff"},
  {label: "Редагувати файли", value: "edit-files"},
  {label: "Редагувати користувачів", value: "edit-users"},

]

export default function UserCrudForm() {
  return (
    <>
      <Form.Item hidden name="_id">
        <Input type="hidden"/>
      </Form.Item>
      <Form.Item<IUser>
        label="Логін"
        name="login"
        extra="Логін користувача"
        style={{marginBottom: 0}}
        rules={[{required: true, message: "Введіть логін користувача!"}]}
      >
        <Input/>
      </Form.Item>
      <Form.Item<IUser>
        label="Ім'я"
        name="name"
        extra="Ім'я користувача"
        style={{marginBottom: 0}}
        rules={[{required: true, message: "Введіть ім'я користувача!"}]}
      >
        <Input/>
      </Form.Item>
      <Form.Item<IDynamicPage>
        label="Дозволи"
        name="permissions"
        extra="Дозволи користувачу"
        style={{marginBottom: 0}}
      >
        <Select
          mode="multiple"
          options={PERMISSIONS_OPTIONS as never}
          filterSort={(a, b) => (
            (a.value as string).localeCompare((b.value as string))
          )}
        />
      </Form.Item>
    </>
  )
}
