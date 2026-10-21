import {App, Button, Drawer, Flex, theme} from "antd";
import {PageComponentRenderer} from "@/entities/dynamic-page/ui";
import {useEffect, useState} from "react";
import {IBasePageComponent} from "@/entities/dynamic-page";
import {EditorFormHostContext, useEditorFormHost} from "@/shared/ui-kit";

interface IProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  component: IBasePageComponent;
  updateComponent: (value: IBasePageComponent) => void;
}

export default function ComponentSettingsDrawer(props: IProps) {
  const {token: {padding}} = theme.useToken();
  const {notification} = App.useApp();
  const {host, validate} = useEditorFormHost();
  const [localComponentState, setLocalComponentState] = useState<IBasePageComponent>(props.component)

  useEffect(() => {
    setLocalComponentState(() => props.component);
  }, [props.component]);

  const onOk = async () => {
    const error = await validate();

    if (error != null) {
      notification.error({title: "Заповніть обов'язкові поля", description: error || undefined});
      return;
    }

    props.updateComponent(localComponentState);
    props.setIsOpen(false);
  }

  const onCancel = () => {
    setLocalComponentState(() => props.component);
    props.setIsOpen(false);
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
      <EditorFormHostContext value={host}>
        <PageComponentRenderer
          component={localComponentState}
          editMode
          onChange={setLocalComponentState}
        />
      </EditorFormHostContext>
    </Drawer>
  )
}
