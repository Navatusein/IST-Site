import {Form, FormListFieldData, FormListOperation, Input, InputNumber} from "antd";
import {FormSortableList} from "@/shared/ui-kit";
import {IHeroSectionMainStatistics} from "../../types/type";

interface IProps {
  fields: FormListFieldData[],
  operations: FormListOperation
}

export default function FormComponentStatistics(props: IProps) {
  const getTitle = (statistic: IHeroSectionMainStatistics | undefined, index: number) => {
    if (!statistic?.title)
      return `Картка статистики ${index + 1}`;

    return statistic.value != null ? `${statistic.value} — ${statistic.title}` : statistic.title;
  }

  return (
    <FormSortableList<IHeroSectionMainStatistics>
      listName="statistics"
      fields={props.fields}
      operations={props.operations}
      getTitle={getTitle}
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
            name={[field.name, "value"]}
            label="Значення"
            style={{marginBottom: 0}}
            extra="Число, яке відлічується, коли блок з'являється на екрані"
          >
            <InputNumber style={{width: "100%"}}/>
          </Form.Item>
        </>
      )}
      addLabel="Додати картку статистики"
      createItem={() => ({title: "", value: 0})}
    />
  )
}
