import {Flex, Form, Input, Select} from "antd";
import {SelectFileButton} from "@/entities/file/ui";
import {IPageComponentEditorProps} from "@/entities/dynamic-page/model";
import {EditorForm} from "@/shared/ui-kit";
import {IImagePageComponent} from "../../types/type";

export default function ImageEditor(props: IPageComponentEditorProps<IImagePageComponent>) {
  return (
    <EditorForm value={props.component} onChange={props.onChange}>
      <Flex vertical gap="small">
        <Form.Item<IImagePageComponent>
          label="Фото"
          name="imageSlug"
          style={{marginBottom: 0}}
        >
          <SelectFileButton filter={["image"]}/>
        </Form.Item>
        <Form.Item<IImagePageComponent>
          label="Підпис"
          name="caption"
          style={{marginBottom: 0}}
          extra="Текст під фото, також слугує описом зображення"
        >
          <Input.TextArea rows={2}/>
        </Form.Item>
        <Form.Item<IImagePageComponent>
          label="Пропорції"
          name="aspectRatio"
          style={{marginBottom: 0}}
          extra="Фото буде обрізано під вибрані пропорції"
        >
          <Select options={[
            {label: "Оригінальні", value: "original"},
            {label: "16:9", value: "16/9"},
            {label: "4:3", value: "4/3"},
            {label: "1:1", value: "1/1"},
          ]}/>
        </Form.Item>
      </Flex>
    </EditorForm>
  )
}
