import {Button, Card, Flex, Form, FormListFieldData, FormListOperation, Input, InputNumber} from "antd";
import {PlusOutlined} from "@ant-design/icons";
import IconSelect from "../../../../features/icon-select/ui/icon-select/icon-select";

interface IProps {
  fields: FormListFieldData[],
  operations:  FormListOperation
}

export default function FormComponentStatistics(props: IProps) {
  return (
    <>
      {props.fields.map(({key, name, ...restField }) => (
        <Card key={key} size="small">
          <Flex vertical gap="small">
            <Form.Item
              {...restField}
              name={[name, "title"]}
              label="Заголовок"
              style={{marginBottom: 0}}
              extra="Заголовок картки статистики"
            >
              <Input/>
            </Form.Item>
            <Form.Item
              {...restField}
              name={[name, "icon"]}
              label="Іконка"
              style={{marginBottom: 0}}
              extra="Іконка картки статистики"
            >
              <IconSelect/>
            </Form.Item>
            <Form.Item
              {...restField}
              name={[name, "value"]}
              label="Значення"
              style={{marginBottom: 0}}
              extra="Значення картки статистики"
            >
              <InputNumber style={{width: "100%"}}/>
            </Form.Item>
            <Button onClick={() => props.operations.remove(name)} danger>
              Видалити
            </Button>
          </Flex>
        </Card>
      ))}
      <Form.Item style={{marginBottom: 0}}>
        <Button type="dashed" onClick={() => props.operations.add()} block icon={<PlusOutlined/>}>
          Додати картку статистики
        </Button>
      </Form.Item>
    </>
  )
}
