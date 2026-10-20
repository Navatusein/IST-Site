import {Flex, Form, Tabs, TabsProps} from "antd";
import {IPageComponentEditorProps} from "@/entities/dynamic-page/model";
import {EditorForm} from "@/shared/ui-kit";
import {IHeroSectionMainPageComponent} from "../../types/type";
import FormComponentFastLinks from "../form-component-fast-links/form-component-fast-links";
import FormComponentStatistics from "../form-component-statistics/form-component-statistics";
import FormComponentCommon from "../form-component-common/form-component-common";

export default function HeroSectionMainEditor(props: IPageComponentEditorProps<IHeroSectionMainPageComponent>) {
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
      label: "Швидкі посилання",
      forceRender: true,
      children: (
        <Flex vertical gap="small">
          <Form.List name="fastLinks">
            {(fields, operations) =>
              <FormComponentFastLinks fields={fields} operations={operations}/>
            }
          </Form.List>
        </Flex>
      ),
    },
    {
      key: "3",
      label: "Картки статистики",
      forceRender: true,
      children: (
        <Flex vertical gap="small">
          <Form.List name="statistics">
            {(fields, operations) =>
              <FormComponentStatistics fields={fields} operations={operations}/>
            }
          </Form.List>
        </Flex>
      ),
    },
  ];

  return (
    <EditorForm value={props.component} onChange={props.onChange} style={{marginTop: "-24px"}}>
      <Tabs defaultActiveKey="1" items={items}/>
    </EditorForm>
  )
}
