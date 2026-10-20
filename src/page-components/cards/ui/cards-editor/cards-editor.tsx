import {Flex, Form, Tabs, TabsProps} from "antd";
import {IPageComponentEditorProps} from "@/entities/dynamic-page/model";
import {EditorForm} from "@/shared/ui-kit";
import {ICardsPageComponent} from "../../types/type";
import FormComponentCommon from "../form-component-common/form-component-common";
import FormComponentCard from "../form-component-card/form-component-card";

export default function CardsEditor(props: IPageComponentEditorProps<ICardsPageComponent>) {
  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "Загальні налаштування",
      forceRender: true,
      children: (
        <Flex vertical gap="small">
          <FormComponentCommon/>
        </Flex>
      ),
    },
    {
      key: "2",
      label: "Картки",
      forceRender: true,
      children: (
        <Flex vertical gap="small">
          <Form.List name="cards">
            {(fields, operations) =>
              <FormComponentCard fields={fields} operations={operations}/>
            }
          </Form.List>
        </Flex>
      ),
    }
  ];

  return (
    <EditorForm value={props.component} onChange={props.onChange} style={{marginTop: "-24px"}}>
      <Tabs defaultActiveKey="1" items={items}/>
    </EditorForm>
  )
}
