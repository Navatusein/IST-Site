import {Flex, Form} from "antd";
import {FormImageList} from "@/features/form-image-list";
import {IPageComponentEditorProps} from "@/entities/dynamic-page/model";
import {EditorForm} from "@/shared/ui-kit";
import {IGalleryCarouselPageComponent} from "../../types/type";

export default function GalleryCarouselEditor(props: IPageComponentEditorProps<IGalleryCarouselPageComponent>) {
  return (
    <EditorForm value={props.component} onChange={props.onChange}>
      <Flex vertical gap="small">
        <Form.List name="imageSlugs">
          {(fields, operations) => (
            <FormImageList<string | null>
              listName="imageSlugs"
              fields={fields}
              operations={operations}
              imageName={(name) => [name]}
              createItem={(imageSlug) => imageSlug}
              getImageSlug={(imageSlug) => imageSlug}
            />
          )}
        </Form.List>
      </Flex>
    </EditorForm>
  )
}
