import {useMemo} from "react";
import {IBasePageComponent} from "@/entities/dynamic-page";
import {PageComponentError} from "@/shared/ui-kit";
import {ILinkButtonPageComponent, LinkButtonTypes} from "../../types/type";
import {Flex, Form, Input, Select} from "antd";
import {SelectFileButton} from "@/features/select-file-button";

interface IProps {
  component: IBasePageComponent;
  onChange: (value: IBasePageComponent) => void;
}

export default function LinkButtonEditor(props: IProps) {
  const [form] = Form.useForm();

  const linkType = Form.useWatch<LinkButtonTypes>("linkType", form);

  const typedComponent = useMemo(() => {
    if (props.component.componentType !== "link-button")
      return null;

    return props.component as ILinkButtonPageComponent;
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
          <Form.Item<ILinkButtonPageComponent>
            label="Текст"
            name="title"
            style={{marginBottom: 0}}
            extra="Текст кнопки"
          >
            <Input/>
          </Form.Item>
          <Form.Item<ILinkButtonPageComponent>
            label="Тип кнопки"
            name="linkType"
            style={{marginBottom: 0}}
            extra="Рівень заголовку елемента"
          >
            <Select options={[
              {label: "Посилання на сайт", value: "link"},
              {label: "Посилання на файл", value: "file"},
              {label: "Посилання на сторінку", value: "page"},
            ]}/>
          </Form.Item>
          {linkType == "link" && (
            <Form.Item<ILinkButtonPageComponent>
              label="Посилання"
              name="link"
              style={{marginBottom: 0}}
              extra="Посилання на інший сайт"
            >
              <Input/>
            </Form.Item>
          )}
          {linkType == "file" && (
            <Form.Item<ILinkButtonPageComponent>
              label="Файл"
              name="link"
              style={{marginBottom: 0}}
              extra="Посилання на файл"
            >
              <SelectFileButton/>
            </Form.Item>
          )}
          {linkType == "page" && (
            <Form.Item<ILinkButtonPageComponent>
              label="Сторінка"
              name="link"
              style={{marginBottom: 0}}
              extra="Сторінка нашого сайту"
            >
              <Input/>
            </Form.Item>
          )}

        </Flex>
      </Form>
    </PageComponentError>
  )
}