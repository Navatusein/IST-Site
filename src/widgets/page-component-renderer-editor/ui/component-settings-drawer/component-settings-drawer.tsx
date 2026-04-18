import {Button, Drawer, Flex, theme} from "antd";
import {PageComponentRenderer} from "@/widgets/page-component-renderer";
import {Dispatch, SetStateAction, useEffect, useState} from "react";
import {IBasePageComponent} from "@/entities/dynamic-page";

interface IProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  component: IBasePageComponent;
  updateComponent: (value: IBasePageComponent) => void;
}

export default function ComponentSettingsDrawer(props: IProps) {
  const {token: {padding}} = theme.useToken();
  const [localComponentState, setLocalComponentState] = useState<IBasePageComponent>(props.component)

  useEffect(() => {
    setLocalComponentState(() => props.component);
  }, [props.component]);

  const onOk = () => {
    props.updateComponent(localComponentState);
    props.setIsOpen(() => false);
  }

  const onCancel = () => {
    setLocalComponentState(() => props.component);
    props.setIsOpen(() => false);
  }

  return (
    <Drawer
      title="Редагувати компонент"
      open={props.isOpen}
      destroyOnHidden
      onClose={onCancel}
      size="large"
      footer={
        <Flex gap={padding}>
          <Button onClick={onCancel} block>
            Відмінити
          </Button>
          <Button type="primary" onClick={onOk} block>
            Зберегти
          </Button>
        </Flex>
      }
    >
      <PageComponentRenderer
        component={localComponentState}
        editMode
        onChange={setLocalComponentState}
      />
    </Drawer>
  )
}
