import {Button, Card, Flex, Form, FormListFieldData, FormListOperation, Input} from "antd";
import {PlusOutlined} from "@ant-design/icons";

interface IProps {
  fields: FormListFieldData[],
  operations:  FormListOperation
}

export default function FormComponentFastLinks(props: IProps) {
  return (
    <>
      {props.fields.map(({ key, name, ...restField }) => (
        <Card key={key} size="small">
          <Flex vertical gap="small">
            <Form.Item
              {...restField}
              name={[name, "title"]}
              label="Заголовок"
              style={{marginBottom: 0}}
              extra="Заголовок швидкого посилання"
            >
              <Input/>
            </Form.Item>
            <Form.Item
              {...restField}
              name={[name, "path"]}
              label="Шлях"
              style={{marginBottom: 0}}
              extra="Шлях швидкого посилання"
            >
              <Input/>
            </Form.Item>
            <Button onClick={() => props.operations.remove(name)} danger>
              Видалити
            </Button>
          </Flex>
        </Card>
      ))}
      <Form.Item style={{marginBottom: 0}}>
        <Button type="dashed" onClick={() => props.operations.add()} block icon={<PlusOutlined/>}>
          Додати швидке посилання
        </Button>
      </Form.Item>
    </>
  )
}
