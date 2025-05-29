import {useMemo} from "react";
import {IBasePageComponent} from "@/entities/dynamic-page";
import {PageComponentError} from "@/shared/ui-kit";
import {IHeroSectionMainPageComponent} from "../../types/type";
import {Flex, Form, Input, InputNumber, Tabs, TabsProps} from "antd";
import {SelectFileButton} from "@/features/select-file-button";
import FormComponentFastLinks from "../form-component-fast-links/form-component-fast-links";
import FormComponentStatistics from "../form-component-statistics/form-component-statistics";
import RichTextEditor from "@/features/rich-text-editor/ui/rich-text-editor/rich-text-editor";

interface IProps {
  componentProps: IBasePageComponent;
  onChange: (value: IBasePageComponent) => void;
}

export default function HeroSectionMainEditor(props: IProps) {
  const [form] = Form.useForm();

  const typedComponentProps = useMemo(() => {
    if (props.componentProps.type !== "hero-section-main")
      return null;

    return props.componentProps as IHeroSectionMainPageComponent;
  }, [props]);

  const onChange = () => {
    props.onChange(form.getFieldsValue(true));
  }

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: 'Загалні налаштування',
      children: (
        <Flex vertical gap="small">
          <Form.Item<IHeroSectionMainPageComponent>
            label="Кафедра"
            name="department"
            style={{marginBottom: 0}}
            extra="Назва кафедри"
          >
            <Input/>
          </Form.Item>
          <Form.Item<IHeroSectionMainPageComponent>
            label="Факультет"
            name="faculty"
            style={{marginBottom: 0}}
            extra="Назва факультету"
          >
            <Input/>
          </Form.Item>
          <Form.Item<IHeroSectionMainPageComponent>
            label="Університет"
            name="university"
            style={{marginBottom: 0}}
            extra="Назва університету"
          >
            <Input/>
          </Form.Item>
          <Form.Item<IHeroSectionMainPageComponent>
            label="Текст"
            name="text"
            style={{marginBottom: 0}}
            extra="Текст компоненту"
          >
            <RichTextEditor/>
          </Form.Item>
          <Form.Item<IHeroSectionMainPageComponent>
            label="Малюнок"
            name="imagePath"
            extra="Малюнок новини"
            style={{marginBottom: 0}}
          >
            <SelectFileButton filter={["image"]}/>
          </Form.Item>
          <Form.Item<IHeroSectionMainPageComponent>
            label="Вистота малюнку"
            name="imageHeight"
            style={{marginBottom: 0}}
            extra="Вистота яку буде займати малюнок"
          >
            <InputNumber min={100} style={{width: "100%"}}/>
          </Form.Item>
        </Flex>
      ),
    },
    {
      key: '2',
      label: 'Швидкі посилання',
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
      key: '3',
      label: 'Картки статистики',
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
    <PageComponentError message={typedComponentProps == null ? "Fail" : ""}>
      <Form
        form={form}
        layout="vertical"
        initialValues={typedComponentProps as never}
        style={{width: "100%", marginTop: "-24px"}}
        onFieldsChange={onChange}
      >
        <Tabs defaultActiveKey="1" items={items}/>
      </Form>
    </PageComponentError>
  )
}