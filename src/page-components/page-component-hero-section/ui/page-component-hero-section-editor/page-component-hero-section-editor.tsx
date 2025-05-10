import {IBasePageComponent} from "@/entities/dynamic-page";
import {useMemo} from "react";
import {IHeroSectionPageComponent} from "../../types/type";
import {PageComponentError} from "@/shared/ui-kit";
import {
  Button,
  Card,
  Col, Collapse,
  Flex,
  Form,
  Image,
  Input,
  InputNumber,
  Layout,
  Row,
  Space,
  Statistic, Tabs, TabsProps,
  theme,
  Typography
} from "antd";
import {INews} from "@/entities/news";
import {SelectFileButton} from "@/features/select-file-button";
import {MinusCircleOutlined, PlusOutlined} from "@ant-design/icons";
import FormComponentFastLinks
  from "@/page-components/page-component-hero-section/ui/form-component-fast-links/form-component-fast-links";
import FormComponentStatistics
  from "@/page-components/page-component-hero-section/ui/form-component-statistics/form-component-statistics";

interface IProps {
  componentProps: IBasePageComponent;
  onChange: (value: IBasePageComponent) => void;
}

export default function PageComponentHeroSectionEditor(props: IProps) {
  const [form] = Form.useForm();

  const typedComponentProps = useMemo(() => {
    if (props.componentProps.type !== "hero-section")
      return null;

    return props.componentProps as IHeroSectionPageComponent;
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
          <Form.Item<IHeroSectionPageComponent>
            label="Заголовок"
            name="title"
            style={{marginBottom: 0}}
            extra="Заголовок компоненту"
          >
            <Input/>
          </Form.Item>
          <Form.Item<IHeroSectionPageComponent>
            label="Текст"
            name="text"
            style={{marginBottom: 0}}
            extra="Текст компоненту"
          >
            <Input.TextArea rows={3}/>
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
      {/*<Card variant="borderless" size="small">*/}
        <Form
          form={form}
          layout="vertical"
          initialValues={typedComponentProps as never}
          style={{width: "100%"}}
          onChange={onChange}
        >
          <Tabs defaultActiveKey="1" items={items}/>
        </Form>
      {/*</Card>*/}
    </PageComponentError>
  )
}
