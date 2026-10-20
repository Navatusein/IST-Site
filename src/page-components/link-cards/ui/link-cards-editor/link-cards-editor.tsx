import {Flex, Form, Input, Segmented, Select, Switch, Tabs, TabsProps} from "antd";
import {IPageComponentEditorProps} from "@/entities/dynamic-page/model";
import {EditorForm, FormSortableList} from "@/shared/ui-kit";
import {ILinkCard, ILinkCardsPageComponent} from "../../types/type";
import LinkCardFields from "../link-card-fields/link-card-fields";

export default function LinkCardsEditor(props: IPageComponentEditorProps<ILinkCardsPageComponent>) {
  const [form] = Form.useForm();

  const buttonText = Form.useWatch<string>("buttonText", form) || props.component.buttonText;

  const items: TabsProps["items"] = [
    {
      key: "common",
      label: "Загальні налаштування",
      forceRender: true,
      children: (
        <Flex vertical gap="small">
          <Form.Item<ILinkCardsPageComponent>
            label="Кількість карток в ряд"
            name="columns"
            style={{marginBottom: 0}}
            extra="На вузьких екранах карток в ряд буде менше"
          >
            <Select options={[
              {label: "2 картки", value: 2},
              {label: "3 картки", value: 3},
              {label: "4 картки", value: 4},
            ]}/>
          </Form.Item>
          <Form.Item<ILinkCardsPageComponent>
            label="Нумерація"
            name="showNumbers"
            valuePropName="checked"
            style={{marginBottom: 0}}
            extra="Великий номер над назвою картки"
          >
            <Switch/>
          </Form.Item>
          <Form.Item<ILinkCardsPageComponent>
            label="Текст кнопок"
            name="buttonText"
            style={{marginBottom: 0}}
            extra="Можна змінити для окремої картки"
            rules={[{required: true, whitespace: true, message: "Введіть текст кнопок"}]}
          >
            <Input/>
          </Form.Item>
          <Form.Item<ILinkCardsPageComponent> label="Стиль кнопок" name="buttonVariant" style={{marginBottom: 0}}>
            <Segmented block options={[
              {label: "Основні", value: "primary"},
              {label: "Звичайні", value: "default"},
            ]}/>
          </Form.Item>
        </Flex>
      ),
    },
    {
      key: "cards",
      label: "Картки",
      forceRender: true,
      children: (
        <Form.List name="cards">
          {(fields, operations) => (
            <FormSortableList<ILinkCard>
              listName="cards"
              fields={fields}
              operations={operations}
              getTitle={(card, index) => card?.title ? `${index + 1}. ${card.title}` : `Картка ${index + 1}`}
              renderFields={(field) => <LinkCardFields field={field} defaultButtonText={buttonText}/>}
              addLabel="Додати картку"
              createItem={() => ({title: "", description: "", linkType: "file", link: ""})}
            />
          )}
        </Form.List>
      ),
    },
  ];

  return (
    <EditorForm value={props.component} onChange={props.onChange} form={form} style={{marginTop: "-24px"}}>
      <Tabs defaultActiveKey="cards" items={items}/>
    </EditorForm>
  )
}
