import {Flex, Form, InputNumber, Switch} from "antd";
import {IPageComponentEditorProps} from "@/entities/dynamic-page/model";
import {EditorForm} from "@/shared/ui-kit";
import {INewsListPageComponent} from "../../types/type";

export default function NewsListEditor(props: IPageComponentEditorProps<INewsListPageComponent>) {
  return (
    <EditorForm value={props.component} onChange={props.onChange}>
      <Flex vertical gap="small">
        <Form.Item<INewsListPageComponent>
          label="Кількість новин"
          name="countDisplayed"
          style={{marginBottom: 0}}
          extra="З пагінацією це кількість новин на одній сторінці"
        >
          <InputNumber min={0} style={{width: "100%"}}/>
        </Form.Item>
        <Form.Item<INewsListPageComponent>
          label="Пагінація"
          name="pagination"
          style={{marginBottom: 0}}
          extra="Перемикач сторінок під списком"
        >
          <Switch/>
        </Form.Item>
      </Flex>
    </EditorForm>
  )
}
