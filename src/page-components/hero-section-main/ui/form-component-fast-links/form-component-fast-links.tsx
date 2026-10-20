import {Form, FormListFieldData, FormListOperation, Input} from "antd";
import {FormSortableList} from "@/shared/ui-kit";
import {IHeroSectionMainFastLink} from "../../types/type";

interface IProps {
  fields: FormListFieldData[],
  operations: FormListOperation
}

export default function FormComponentFastLinks(props: IProps) {
  return (
    <FormSortableList<IHeroSectionMainFastLink>
      listName="fastLinks"
      fields={props.fields}
      operations={props.operations}
      getTitle={(fastLink, index) => fastLink?.title || `Посилання ${index + 1}`}
      renderFields={(field) => (
        <>
          <Form.Item
            name={[field.name, "title"]}
            label="Заголовок"
            style={{marginBottom: 0}}
          >
            <Input/>
          </Form.Item>
          <Form.Item
            name={[field.name, "path"]}
            label="Шлях"
            style={{marginBottom: 0}}
            extra="Адреса сторінки сайту, наприклад /news"
          >
            <Input/>
          </Form.Item>
        </>
      )}
      addLabel="Додати швидке посилання"
      createItem={() => ({title: "", path: ""})}
    />
  )
}
