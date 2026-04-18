import {useMemo} from "react";
import {IBasePageComponent} from "@/entities/dynamic-page";
import {PageComponentError} from "@/shared/ui-kit";
import {ICardsPageComponent} from "../../types/type";
import {Flex, Form, Tabs, TabsProps} from "antd";
import FormComponentCommon from "../form-component-common/form-component-common";
import FormComponentCard from "../form-component-card/form-component-card";

interface IProps {
  component: IBasePageComponent;
  onChange: (value: IBasePageComponent) => void;
}

export default function CardsEditor(props: IProps) {
  const [form] = Form.useForm();

  const typedComponent = useMemo(() => {
    if (props.component.componentType !== "cards")
      return null;

    return props.component as ICardsPageComponent;
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
      label: "Картки",
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