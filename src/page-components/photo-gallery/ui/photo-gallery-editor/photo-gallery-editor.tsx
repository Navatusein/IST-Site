import {Flex, Form, Input, Select} from "antd";
import {FormImageList} from "@/features/form-image-list";
import {IPageComponentEditorProps} from "@/entities/dynamic-page/model";
import {EditorForm} from "@/shared/ui-kit";
import {IPhotoGalleryPageComponent, IPhotoGalleryPhoto} from "../../types/type";

export default function PhotoGalleryEditor(props: IPageComponentEditorProps<IPhotoGalleryPageComponent>) {
  return (
    <EditorForm value={props.component} onChange={props.onChange}>
      <Flex vertical gap="small">
        <Form.Item<IPhotoGalleryPageComponent>
          label="Кількість колонок"
          name="columns"
          style={{marginBottom: 0}}
          extra="На вузьких екранах колонок буде менше"
        >
          <Select options={[
            {label: "2 колонки", value: 2},
            {label: "3 колонки", value: 3},
            {label: "4 колонки", value: 4},
          ]}/>
        </Form.Item>
        <Form.List name="photos">
          {(fields, operations) => (
            <FormImageList<IPhotoGalleryPhoto>
              listName="photos"
              fields={fields}
              operations={operations}
              imageName={(name) => [name, "imageSlug"]}
              createItem={(imageSlug) => ({imageSlug: imageSlug ?? undefined})}
              getImageSlug={(photo) => photo?.imageSlug}
              getTitle={(photo) => photo?.caption}
              renderExtraFields={(field) => (
                <Flex vertical gap="small">
                  <Form.Item name={[field.name, "caption"]} style={{marginBottom: 0}}>
                    <Input placeholder="Підпис (необов'язково)"/>
                  </Form.Item>
                  <Form.Item name={[field.name, "alt"]} style={{marginBottom: 0}}>
                    <Input placeholder="Опис зображення для пошуку (якщо не вказано — підпис)"/>
                  </Form.Item>
                </Flex>
              )}
            />
          )}
        </Form.List>
      </Flex>
    </EditorForm>
  )
}
