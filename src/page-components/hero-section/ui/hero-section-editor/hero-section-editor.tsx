import {useMemo} from "react";
import {IBasePageComponent} from "@/entities/dynamic-page";
import {PageComponentError} from "@/shared/ui-kit";
import {IHeroSectionPageComponent} from "../../types/type";
import {Flex, Form, Input, InputNumber} from "antd";
import {SelectFileButton} from "@/features/select-file-button";

interface IProps {
  componentProps: IBasePageComponent;
  onChange: (value: IBasePageComponent) => void;
}

export default function HeroSectionEditor(props: IProps) {
  const [form] = Form.useForm();

  const typedComponentProps = useMemo(() => {
    if (props.componentProps.type !== "hero-section")
      return null;

    return props.componentProps as IHeroSectionPageComponent;
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
        style={{width: "100%", marginTop: "-24px"}}
        onFieldsChange={onChange}
      >
        <Flex vertical gap="small">
          <Form.Item<IHeroSectionPageComponent>
            label="Заголовок"
            name="title"
            style={{marginBottom: 0}}
            extra="Заголовок сторінки"
          >
            <Input/>
          </Form.Item>
          <Form.Item<IHeroSectionPageComponent>
            label="Малюнок"
            name="imagePath"
            extra="Малюнок новини"
            style={{marginBottom: 0}}
          >
            <SelectFileButton filter={["image"]}/>
          </Form.Item>
          <Form.Item<IHeroSectionPageComponent>
            label="Вистота малюнку"
            name="imageHeight"
            style={{marginBottom: 0}}
            extra="Вистота яку буде займати малюнок"
          >
            <InputNumber min={100} style={{width: "100%"}}/>
          </Form.Item>
        </Flex>
      </Form>
    </PageComponentError>
  )
}