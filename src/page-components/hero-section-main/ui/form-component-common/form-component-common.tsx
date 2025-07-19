import {Form, Input, InputNumber} from "antd";
import { IHeroSectionMainPageComponent } from "../../types/type";
import {RichTextEditor} from "@/features/rich-text-editor";
import {SelectFileButton} from "@/features/select-file-button";

export default function FormComponentCommon() {
  return (
    <>
      <Form.Item<IHeroSectionMainPageComponent>
        label="Кафедра"
        name="department"
        style={{marginBottom: 0}}
        extra="Назва кафедри"
      >
        <Input/>
      </Form.Item>
      <Form.Item<IHeroSectionMainPageComponent>
        label="Факультет"
        name="faculty"
        style={{marginBottom: 0}}
        extra="Назва факультету"
      >
        <Input/>
      </Form.Item>
      <Form.Item<IHeroSectionMainPageComponent>
        label="Університет"
        name="university"
        style={{marginBottom: 0}}
        extra="Назва університету"
      >
        <Input/>
      </Form.Item>
      <Form.Item<IHeroSectionMainPageComponent>
        label="Текст"
        name="text"
        style={{marginBottom: 0}}
        extra="Текст компоненту"
      >
        <RichTextEditor/>
      </Form.Item>
      <Form.Item<IHeroSectionMainPageComponent>
        label="Малюнок"
        name="imagePath"
        extra="Малюнок новини"
        style={{marginBottom: 0}}
      >
        <SelectFileButton filter={["image"]}/>
      </Form.Item>
      <Form.Item<IHeroSectionMainPageComponent>
        label="Вистота малюнку"
        name="imageHeight"
        style={{marginBottom: 0}}
        extra="Вистота яку буде займати малюнок"
      >
        <InputNumber min={100} style={{width: "100%"}}/>
      </Form.Item>
    </>
  )
}
