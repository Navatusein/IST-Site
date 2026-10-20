import {Flex, Form, Input, Select, Switch} from "antd";
import {SelectFileButton} from "@/entities/file/ui";
import {IPageComponentEditorProps} from "@/entities/dynamic-page/model";
import {EditorForm} from "@/shared/ui-kit";
import {IDocumentPageComponent} from "../../types/type";

export default function DocumentEditor(props: IPageComponentEditorProps<IDocumentPageComponent>) {
  return (
    <EditorForm value={props.component} onChange={props.onChange}>
      <Flex vertical gap="small">
        <Form.Item<IDocumentPageComponent>
          label="Файл"
          name="fileSlug"
          style={{marginBottom: 0}}
          rules={[{required: true, message: "Оберіть файл"}]}
          extra="PDF, Word, Excel, PowerPoint, відео, аудіо, зображення або текст"
        >
          <SelectFileButton/>
        </Form.Item>
        <Form.Item<IDocumentPageComponent>
          label="Заголовок"
          name="title"
          style={{marginBottom: 0}}
          extra="Якщо не вказано, не показується"
        >
          <Input/>
        </Form.Item>
        <Form.Item<IDocumentPageComponent>
          label="Пропорції"
          name="aspectRatio"
          style={{marginBottom: 0}}
          extra="Автоматично: 16:9 для презентацій і відео, A4 для документів"
        >
          <Select options={[
            {label: "Автоматично", value: "auto"},
            {label: "A4 (вертикально)", value: "a4"},
            {label: "16:9", value: "16/9"},
            {label: "4:3", value: "4/3"},
          ]}/>
        </Form.Item>
        <Form.Item<IDocumentPageComponent>
          label="Панель файлу"
          name="showFileBar"
          valuePropName="checked"
          style={{marginBottom: 0}}
          extra="Назва, розмір і кнопки «Відкрити» та «Завантажити» під документом"
        >
          <Switch/>
        </Form.Item>
      </Flex>
    </EditorForm>
  )
}
