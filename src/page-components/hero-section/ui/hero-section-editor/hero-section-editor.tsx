import {Flex, Form, InputNumber} from "antd";
import {SelectFileButton} from "@/entities/file/ui";
import {IPageComponentEditorProps} from "@/entities/dynamic-page/model";
import {EditorForm} from "@/shared/ui-kit";
import {RichTextEditor} from "@/features/rich-text-editor";
import {IHeroSectionPageComponent} from "../../types/type";

export default function HeroSectionEditor(props: IPageComponentEditorProps<IHeroSectionPageComponent>) {
  return (
    <EditorForm value={props.component} onChange={props.onChange} style={{marginTop: "-24px"}}>
      <Flex vertical gap="small">
        <Form.Item<IHeroSectionPageComponent>
          label="Заголовок"
          name="title"
          style={{marginBottom: 0}}
        >
          <RichTextEditor style={{textAlign: "center"}}/>
        </Form.Item>
        <Form.Item<IHeroSectionPageComponent>
          label="Малюнок"
          name="imageSlug"
          extra="Фон під заголовком"
          style={{marginBottom: 0}}
        >
          <SelectFileButton filter={["image"]}/>
        </Form.Item>
        <Form.Item<IHeroSectionPageComponent>
          label="Висота малюнку"
          name="imageHeight"
          style={{marginBottom: 0}}
          extra="Висота фону в пікселях"
        >
          <InputNumber min={100} style={{width: "100%"}}/>
        </Form.Item>
      </Flex>
    </EditorForm>
  )
}
