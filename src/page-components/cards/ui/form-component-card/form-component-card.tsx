import {Button, Card, Flex, Form, FormListFieldData, FormListOperation} from "antd";
import {PlusOutlined} from "@ant-design/icons";
import {RichTextEditor} from "@/features/rich-text-editor";

interface IProps {
  fields: FormListFieldData[],
  operations:  FormListOperation
}

export default function FormComponentCard(props: IProps) {
  return (
    <>
      {props.fields.map(({key, name, ...restField}) => (
        <Card key={key} size="small">
          <Flex vertical gap="small">
            <Form.Item
              {...restField}
              name={[name, "content"]}
              label="Контент картки"
              style={{marginBottom: 0}}
              extra="Редагування контенту картки"
            >
              <RichTextEditor/>
            </Form.Item>
            <Button onClick={() => props.operations.remove(name)} danger>
              Видалити
            </Button>
          </Flex>
        </Card>
      ))}
      <Form.Item style={{marginBottom: 0}}>
        <Button type="dashed" onClick={() => props.operations.add()} block icon={<PlusOutlined/>}>
          Додати картку
        </Button>
      </Form.Item>
    </>
  )
}
