import {Button, Drawer, Flex, Switch, Typography} from "antd";
import {Dispatch, SetStateAction} from "react";

interface IProps {
  isDrawerOpen: boolean;
  setIsDrawerOpen: Dispatch<SetStateAction<boolean>>;
  editMode: boolean;
  setEditMode: Dispatch<SetStateAction<boolean>>;
  savePage: () => void;
}

export default function DynamicPageEditorDrawer(props: IProps) {

  const closeDrawer = () => {
    props.setIsDrawerOpen(() => false);
  }

  return (
    <Drawer open={props.isDrawerOpen} onClose={closeDrawer} title="Редагування сторінки">
      <Flex vertical gap="middle" justify="space-between" style={{height: "100%"}}>
        <Flex gap="small">
          <Typography.Text>Режим редагування:</Typography.Text>
          <Switch value={props.editMode} onChange={() => props.setEditMode((prevState) => !prevState)}/>
        </Flex>
        <Flex style={{width: "100%"}} gap="small">
          <Button style={{width: "50%"}}>
            Відмінити
          </Button>
          <Button htmlType="submit" type="primary" style={{width: "50%"}} onClick={() => props.savePage()}>
            Зберегти
          </Button>
        </Flex>
      </Flex>
    </Drawer>
  )
}
