import {useMemo} from "react";
import {IBasePageComponent} from "@/entities/dynamic-page";
import {PageComponentError} from "@/shared/ui-kit";
import {IHeroSectionMainPageComponent} from "../../types/type";
import {Flex, Form, Tabs, TabsProps} from "antd";
import FormComponentFastLinks from "../form-component-fast-links/form-component-fast-links";
import FormComponentStatistics from "../form-component-statistics/form-component-statistics";
import FormComponentCommon from "../form-component-common/form-component-common";

interface IProps {
  component: IBasePageComponent;
  onChange: (value: IBasePageComponent) => void;
}

export default function HeroSectionMainEditor(props: IProps) {
  const [form] = Form.useForm();

  const typedComponent = useMemo(() => {
    if (props.component.componentType !== "hero-section-main")
      return null;

    return props.component as IHeroSectionMainPageComponent;
  }, [props]);

  const onChange = () => {
    props.onChange(form.getFieldsValue(true));
  }

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "Загальні налаштування",
      children: (
        <Flex vertical gap="small">
          <FormComponentCommon/>
        </Flex>
      ),
    },
    {
      key: "2",
      label: "Швидкі посилання",
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
    <PageComponentError component={typedComponent}>
      <Form
        form={form}
        layout="vertical"
        initialValues={typedComponent as never}
        style={{width: "100%", marginTop: "-24px"}}
        onFieldsChange={onChange}
      >
        <Tabs defaultActiveKey="1" items={items}/>
      </Form>
    </PageComponentError>
  )
}