import {Flex, Form, InputNumber, Switch} from "antd";
import {IPageComponentEditorProps} from "@/entities/dynamic-page/model";
import {EditorForm} from "@/shared/ui-kit";
import {INewsListPageComponent} from "../../types/type";
import {MAX_NEWS_COUNT, MIN_NEWS_COUNT} from "../../utilities/news-count";

export default function NewsListEditor(props: IPageComponentEditorProps<INewsListPageComponent>) {
  return (
    <EditorForm value={props.component} onChange={props.onChange}>
      <Flex vertical gap="small">
        <Form.Item<INewsListPageComponent>
          label="Кількість новин"
          name="countDisplayed"
          style={{marginBottom: 0}}
          extra={`Від ${MIN_NEWS_COUNT} до ${MAX_NEWS_COUNT}; з пагінацією це кількість новин на одній сторінці`}
          rules={[{required: true, message: "Вкажіть кількість новин"}]}
        >
          <InputNumber min={MIN_NEWS_COUNT} max={MAX_NEWS_COUNT} precision={0} style={{width: "100%"}}/>
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
