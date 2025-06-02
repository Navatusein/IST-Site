import {App, Button, Flex, Layout, theme} from "antd";
import {Icon} from "@/shared/ui-kit";
import {useRouter} from "next/navigation";

interface IProps {
  isChanged: boolean;
  saveChanges: () => void;
  cancelChanges: () => void;
}

export default function DynamicPageHeader(props: IProps) {
  const router = useRouter();
  const {modal} = App.useApp();
  const {token: {colorBgContainer}} = theme.useToken();

  const back = () => {
    if (!props.isChanged) {
      router.back();
      return;
    }


    modal.confirm({
      title: "Повернутись",
      content: "У редакторі є незбережені зміни. Ви впевнені, що хочете вийти?",
      okText: "Так",
      cancelText: "Ні",
      onOk: () => {
        router.back();
      }
    });
  }

  return (
    <Layout.Header style={{padding: `0 8px 0 0`, background: colorBgContainer, position: "sticky", top: 0, zIndex: "1000"}}>
      <Flex justify="space-between" align="center" style={{height: "100%"}}>
        <Icon showText={true} style={{width: 300}}/>
        <Flex gap="middle" align="center">
          <Flex gap="small">
            <Button onClick={() => back()}>
              Повернутись назад
            </Button>
            <Button onClick={() => props.cancelChanges()} disabled={!props.isChanged}>
              Відмінити
            </Button>
            <Button type="primary" onClick={() => props.saveChanges()} disabled={!props.isChanged}>
              Зберегти
            </Button>
          </Flex>
        </Flex>
      </Flex>
    </Layout.Header>
  );
}
