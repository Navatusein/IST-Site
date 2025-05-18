import {useMemo} from "react";
import {IBasePageComponent} from "@/entities/dynamic-page";
import {PageComponentError} from "@/shared/ui-kit";
import {INewsListPageComponent} from "../../types/type";
import {Flex, Form, InputNumber, Switch} from "antd";

interface IProps {
  componentProps: IBasePageComponent;
  onChange: (value: IBasePageComponent) => void;
}

export default function NewsListEditor(props: IProps) {
  const [form] = Form.useForm();

  const typedComponentProps = useMemo(() => {
    if (props.componentProps.type !== "news-list")
      return null;

    return props.componentProps as INewsListPageComponent;
  }, [props]);

  const onChange = () => {
    props.onChange(form.getFieldsValue(true));
  }

  return (
    <PageComponentError message={typedComponentProps == null ? "Fail" : ""}>
      <Form
        form={form}
        layout="vertical"
        initialValues={typedComponentProps as never}
        style={{width: "100%"}}
        onFieldsChange={onChange}
      >
        <Flex vertical gap="small">
          <Form.Item<INewsListPageComponent>
            label="Кільксть новин"
            name="countDisplayed"
            style={{marginBottom: 0}}
            extra="Кількість новин яка буде відображатись в списку"
          >
            <InputNumber min={0} style={{width: "100%"}}/>
          </Form.Item>
          <Form.Item<INewsListPageComponent>
            label="Пагінація"
            name="pagination"
            style={{marginBottom: 0}}
            extra="Відображати пагінацію"
          >
            <Switch onChange={onChange}/>
          </Form.Item>
        </Flex>
      </Form>
    </PageComponentError>
  )
}