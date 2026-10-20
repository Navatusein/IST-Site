import {Form, Input, InputNumber} from "antd";
import {IHeroSectionMainPageComponent} from "../../types/type";
import {RichTextEditor} from "@/features/rich-text-editor";
import {SelectFileButton} from "@/entities/file/ui";

export default function FormComponentCommon() {
  return (
    <>
      <Form.Item<IHeroSectionMainPageComponent>
        label="Кафедра"
        name="department"
        style={{marginBottom: 0}}
      >
        <Input/>
      </Form.Item>
      <Form.Item<IHeroSectionMainPageComponent>
        label="Факультет"
        name="faculty"
        style={{marginBottom: 0}}
      >
        <Input/>
      </Form.Item>
      <Form.Item<IHeroSectionMainPageComponent>
        label="Університет"
        name="university"
        style={{marginBottom: 0}}
      >
        <Input/>
      </Form.Item>
      <Form.Item<IHeroSectionMainPageComponent>
        label="Текст"
        name="text"
        style={{marginBottom: 0}}
      >
        <RichTextEditor/>
      </Form.Item>
      <Form.Item<IHeroSectionMainPageComponent>
        label="Малюнок"
        name="imageSlug"
        extra="Фон під заголовком"
        style={{marginBottom: 0}}
      >
        <SelectFileButton filter={["image"]}/>
      </Form.Item>
      <Form.Item<IHeroSectionMainPageComponent>
        label="Висота малюнку"
        name="imageHeight"
        style={{marginBottom: 0}}
        extra="Висота фону в пікселях"
      >
        <InputNumber min={100} style={{width: "100%"}}/>
      </Form.Item>
    </>
  )
}
