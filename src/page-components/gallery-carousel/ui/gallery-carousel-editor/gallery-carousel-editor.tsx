import {useMemo} from "react";
import {IBasePageComponent} from "@/entities/dynamic-page";
import {PageComponentError} from "@/shared/ui-kit";
import {IGalleryCarouselPageComponent} from "../../types/type";
import {Button, Card, Flex, Form} from "antd";
import {PlusOutlined} from "@ant-design/icons";
import {SelectFileButton} from "@/features/select-file-button";

interface IProps {
  component: IBasePageComponent;
  onChange: (value: IBasePageComponent) => void;
}

export default function GalleryCarouselEditor(props: IProps) {
  const [form] = Form.useForm();

  const typedComponent = useMemo(() => {
    if (props.component.componentType !== "gallery-carousel")
      return null;

    return props.component as IGalleryCarouselPageComponent;
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
          <Form.List name="imagePaths">
            {(fields, operations) => (
              <>
                {fields.map(({key, ...field}) => (
                  <Card key={`card-${key}`} size="small">
                    <Flex vertical gap="small">
                      <Form.Item
                        {...field}
                        label="Малюнок"
                        extra="Малюнок галереї"
                        style={{marginBottom: 0}}
                      >
                        <SelectFileButton filter={["image"]}/>
                      </Form.Item>
                      <Button onClick={() => operations.remove(field.name)} danger>
                        Видалити
                      </Button>
                    </Flex>
                  </Card>
                ))}
                <Form.Item style={{marginBottom: 0}}>
                  <Button type="dashed" onClick={() => operations.add()} block icon={<PlusOutlined/>}>
                    Додати зображення
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </Flex>
      </Form>
    </PageComponentError>
  )
}