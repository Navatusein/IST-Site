import {Form, Input, Select} from "antd";
import {IDynamicPage} from "@/entities/dynamic-page";
import {IUser} from "@/entities/user";
import type {SelectProps} from "antd";

interface IProps {

}

const PERMISSIONS_OPTIONS: SelectProps["options"] = [
  {label: "Edit news", value: "edit-news"},
  {label: "Edit pages", value: "edit-pages"},
  {label: "Edit files", value: "edit-files"},
  {label: "Edit users", value: "edit-users"},
]

export default function UserCrudForm(props: IProps) {
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
          options={PERMISSIONS_OPTIONS}
          filterSort={(a, b) => (
            (a.value as string).localeCompare((b.value as string))
          )}
        />
      </Form.Item>
    </>
  )
}
