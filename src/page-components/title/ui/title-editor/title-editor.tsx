import {useMemo} from "react";
import {IBasePageComponent} from "@/entities/dynamic-page";
import {PageComponentError} from "@/shared/ui-kit";
import {ITitlePageComponent} from "../../types/type";
import {Flex, Form, Input, Select} from "antd";

interface IProps {
  component: IBasePageComponent;
  onChange: (value: IBasePageComponent) => void;
}

export default function TitleEditor(props: IProps) {
  const [form] = Form.useForm();

  const typedComponent = useMemo(() => {
    if (props.component.componentType !== "title")
      return null;

    return props.component as ITitlePageComponent;
  }, [props]);

  const onChange = () => {
    props.onChange(form.getFieldsValue(true));
  }

  return (
    <PageComponentError component={typedComponent}>
      <Form
        form={form}
        layout="vertical"
        initialValues={typedComponent as never}
        style={{width: "100%"}}
        onFieldsChange={onChange}
      >
        <Flex vertical gap="small">
          <Form.Item<ITitlePageComponent>
            label="Рівень заголовку"
            name="level"
            style={{marginBottom: 0}}
            extra="Рівень заголовку елемента"
          >
            <Select options={[
              {title: "Рівень 1", value: 1},
              {title: "Рівень 2", value: 2},
              {title: "Рівень 3", value: 3},
              {title: "Рівень 4", value: 4},
              {title: "Рівень 5", value: 5},
            ]}/>
          </Form.Item>
          <Form.Item<ITitlePageComponent>
            label="Текст"
            name="title"
            style={{marginBottom: 0}}
            extra="Текст заголовку комнонента"
          >
            <Input.TextArea rows={3}/>
          </Form.Item>
        </Flex>
      </Form>
    </PageComponentError>
  )
}