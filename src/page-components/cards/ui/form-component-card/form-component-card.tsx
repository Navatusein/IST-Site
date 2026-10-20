import {Form, FormListFieldData, FormListOperation} from "antd";
import {RichTextEditor} from "@/features/rich-text-editor";
import {FormSortableList} from "@/shared/ui-kit";
import richTextToPlainText from "@/shared/utilities/rich-text-to-plain-text";
import {ICardsPageComponent} from "../../types/type";

interface IProps {
  fields: FormListFieldData[],
  operations: FormListOperation
}

type Card = ICardsPageComponent["cards"][number];

export default function FormComponentCard(props: IProps) {
  const getTitle = (card: Card | undefined, index: number) => {
    const text = richTextToPlainText(card?.content);
    return text ? `Картка ${index + 1}: ${text}` : `Картка ${index + 1}`;
  }

  return (
    <FormSortableList<Card>
      listName="cards"
      fields={props.fields}
      operations={props.operations}
      getTitle={getTitle}
      renderFields={(field) => (
        <Form.Item name={[field.name, "content"]} style={{marginBottom: 0}}>
          <RichTextEditor/>
        </Form.Item>
      )}
      addLabel="Додати картку"
    />
  )
}
