import {Flex, Form, Input, Select} from "antd";
import {IPageComponentEditorProps} from "@/entities/dynamic-page/model";
import {EditorForm} from "@/shared/ui-kit";
import {ITitlePageComponent} from "../../types/type";

export default function TitleEditor(props: IPageComponentEditorProps<ITitlePageComponent>) {
  return (
    <EditorForm value={props.component} onChange={props.onChange}>
      <Flex vertical gap="small">
        <Form.Item<ITitlePageComponent>
          label="Рівень заголовку"
          name="level"
          style={{marginBottom: 0}}
          extra="Чим менший рівень, тим більший заголовок"
        >
          <Select options={[
            {title: "Рівень 1", value: 1},
            {title: "Рівень 2", value: 2},
            {title: "Рівень 3", value: 3},
            {title: "Рівень 4", value: 4},
            {title: "Рівень 5", value: 5},
          ]}/>
        </Form.Item>
        <Form.Item<ITitlePageComponent>
          label="Текст"
          name="title"
          style={{marginBottom: 0}}
        >
          <Input.TextArea rows={3}/>
        </Form.Item>
      </Flex>
    </EditorForm>
  )
}
