import {Flex, Form, Segmented, Switch, Tabs, TabsProps} from "antd";
import {IPageComponentEditorProps} from "@/entities/dynamic-page/model";
import {EditorForm, FormSortableList} from "@/shared/ui-kit";
import {IButtonsItem, IButtonsPageComponent} from "../../types/type";
import ButtonFields from "../button-fields/button-fields";

export default function ButtonsEditor(props: IPageComponentEditorProps<IButtonsPageComponent>) {
  const [form] = Form.useForm();

  const fullWidth = Form.useWatch<boolean>("fullWidth", form);

  const items: TabsProps["items"] = [
    {
      key: "common",
      label: "Загальні налаштування",
      forceRender: true,
      children: (
        <Flex vertical gap="small">
          <Form.Item<IButtonsPageComponent> label="Розташування" name="layout" style={{marginBottom: 0}}>
            <Segmented block options={[
              {label: "В ряд", value: "row"},
              {label: "Стовпчиком", value: "column"},
            ]}/>
          </Form.Item>
          <Form.Item<IButtonsPageComponent>
            label="На всю ширину"
            name="fullWidth"
            valuePropName="checked"
            style={{marginBottom: 0}}
            extra="Кнопки в ряд ділять ширину порівну"
          >
            <Switch/>
          </Form.Item>
          <Form.Item<IButtonsPageComponent> label="Вирівнювання" name="align" style={{marginBottom: 0}}>
            <Segmented block disabled={fullWidth} options={[
              {label: "Ліворуч", value: "start"},
              {label: "По центру", value: "center"},
              {label: "Праворуч", value: "end"},
            ]}/>
          </Form.Item>
          <Form.Item<IButtonsPageComponent> label="Стиль" name="variant" style={{marginBottom: 0}}>
            <Segmented block options={[
              {label: "Основні", value: "primary"},
              {label: "Звичайні", value: "default"},
            ]}/>
          </Form.Item>
        </Flex>
      ),
    },
    {
      key: "buttons",
      label: "Кнопки",
      forceRender: true,
      children: (
        <Form.List name="buttons">
          {(fields, operations) => (
            <FormSortableList<IButtonsItem>
              listName="buttons"
              fields={fields}
              operations={operations}
              getTitle={(button, index) => button?.title || `Кнопка ${index + 1}`}
              renderFields={(field) => <ButtonFields field={field}/>}
              addLabel="Додати кнопку"
              createItem={() => ({title: "", linkType: "link", link: ""})}
            />
          )}
        </Form.List>
      ),
    },
  ];

  return (
    <EditorForm value={props.component} onChange={props.onChange} form={form} style={{marginTop: "-24px"}}>
      <Tabs defaultActiveKey="buttons" items={items}/>
    </EditorForm>
  )
}
