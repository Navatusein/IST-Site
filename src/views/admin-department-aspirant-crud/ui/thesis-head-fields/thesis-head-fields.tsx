import {useState} from "react";
import {Flex, Form, Input, Radio, Select} from "antd";
import {IDepartmentAspirant} from "@/entities/department-aspirant";

interface IProps {
  staffOptions: {value: unknown; label: string}[];
}

export default function ThesisHeadFields(props: IProps) {
  const form = Form.useFormInstance<IDepartmentAspirant>();
  const [isManual, setIsManual] = useState<boolean>(() => !!form.getFieldValue("thesisHeadName"));

  return (
    <Flex vertical gap="small">
      <Form.Item label="Науковий керівник" style={{marginBottom: 0}}>
        <Radio.Group
          value={isManual}
          onChange={(event) => setIsManual(event.target.value)}
          options={[
            {value: false, label: "Працівник кафедри"},
            {value: true, label: "Ввести вручну"}
          ]}
        />
      </Form.Item>
      {isManual ? (
        <Form.Item<IDepartmentAspirant>
          name="thesisHeadName"
          extra="Прізвище, ім'я та по батькові керівника, якого немає серед працівників кафедри"
          style={{marginBottom: 0}}
          rules={[{required: true, whitespace: true, message: "Введіть ПІБ наукового керівника!"}]}
        >
          <Input placeholder="Прізвище Ім'я По батькові"/>
        </Form.Item>
      ) : (
        <Form.Item<IDepartmentAspirant>
          name="thesisHeadId"
          style={{marginBottom: 0}}
          rules={[{required: true, message: "Виберіть наукового керівника!"}]}
        >
          <Select options={props.staffOptions} showSearch={{optionFilterProp: "label"}} placeholder="Виберіть працівника кафедри"/>
        </Form.Item>
      )}
    </Flex>
  )
}
