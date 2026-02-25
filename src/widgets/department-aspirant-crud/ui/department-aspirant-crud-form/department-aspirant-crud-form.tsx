import {DatePicker, Form, Input, Select} from "antd";
import {SelectFileButton} from "@/features/select-file-button";
import {IDepartmentStaff} from "@/entities/department-staff";
import {IDepartmentAspirant} from "@/entities/department-aspirant/types/type";
import dayjs from "dayjs";
import {useMemo} from "react";

interface IProps {
  departmentStaff: IDepartmentStaff[];
}

export default function DepartmentAspirantCrudForm(props: IProps) {
  const departmentStaffSelectOptions = useMemo(() => {
    return props.departmentStaff.map((value) => ({
      value: value._id,
      label: `${value.lastName} ${value.firstName} ${value.middleName}`,
    }))
  }, [props.departmentStaff]);

  return (
    <>
      <Form.Item<IDepartmentAspirant> hidden name="_id">
          <Input type="hidden"/>
        </Form.Item>
        <Form.Item<IDepartmentAspirant> hidden name="components">
          <Input type="hidden"/>
        </Form.Item>
        <Form.Item<IDepartmentAspirant>
          label="Фамілія"
          name="lastName"
          extra="Фамілія аспіранта"
          style={{marginBottom: 0}}
          rules={[{required: true, message: "Введіть фамілію аспіранта!"}]}
        >
          <Input/>
        </Form.Item>
        <Form.Item<IDepartmentAspirant>
          label="Ім'я"
          name="firstName"
          extra="Ім'я аспіранта"
          style={{marginBottom: 0}}
          rules={[{required: true, message: "Введіть ім'я аспіранта!"}]}
        >
          <Input/>
        </Form.Item>
        <Form.Item<IDepartmentAspirant>
          label="Ім'я по батькові"
          name="middleName"
          extra="Ім'я по батькові аспіранта"
          style={{marginBottom: 0}}
          rules={[{required: true, message: "Введіть ім'я по батькові аспіранта!"}]}
        >
          <Input/>
        </Form.Item>
        <Form.Item<IDepartmentAspirant>
          label="Керівник"
          name="thesisHeadId"
          extra="Керівник аспіранта"
          style={{marginBottom: 0}}
          rules={[{required: true, message: "Виберіть керівника аспіранта!"}]}
        >
          <Select options={departmentStaffSelectOptions}/>
        </Form.Item>
       <Form.Item<IDepartmentAspirant>
          label="Тема"
          name="thesisTheme"
          extra="Тема аспірантської роботи"
          style={{marginBottom: 0}}
          rules={[{required: true, message: "Введіть тему аспірантської роботи!"}]}
        >
          <Input/>
        </Form.Item>
       <Form.Item<IDepartmentAspirant>
          label="Дата захисту"
          name="thesisDate"
          extra="Дата захисту аспірантської роботи"
          style={{marginBottom: 0}}
          getValueProps={(value) => {
            return {value: value == undefined ? undefined : dayjs(value)}
          }}
        >
          <DatePicker format="DD.MM.YYYY" placeholder="DD.MM.YYYY" style={{width: "100%"}}/>
        </Form.Item>
        <Form.Item<IDepartmentAspirant>
          label="Фотографія"
          name="imagePath"
          extra="Фотографія викладача"
          style={{marginBottom: 0}}
        >
          <SelectFileButton filter={["image"]}/>
        </Form.Item>
    </>
  )
}
