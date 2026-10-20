import {App, Button, Flex, Grid, Layout, theme, Tooltip} from "antd";
import {Icon} from "@/shared/ui-kit";
import {useRouter} from "next/navigation";
import {ArrowLeftOutlined, MenuFoldOutlined, MenuUnfoldOutlined, UndoOutlined} from "@ant-design/icons";
import {ThemeSwitcher} from "@/features/theme-switcher";

interface IProps {
  isChanged: boolean;
  saveChanges: () => void;
  cancelChanges: () => void;
  isOutlineOpen: boolean;
  toggleOutline: () => void;
}

export default function DynamicPageHeader(props: IProps) {
  const router = useRouter();
  const {modal} = App.useApp();
  const {token: {colorBgContainer}} = theme.useToken();

  const isNarrow = Grid.useBreakpoint().md != true;

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
        <Flex align="center" gap="small">
          <Icon showText={!isNarrow} style={isNarrow ? undefined : {width: 300}}/>
          <Button
            type="text"
            icon={props.isOutlineOpen ? <MenuFoldOutlined/> : <MenuUnfoldOutlined/>}
            onClick={props.toggleOutline}
            title={props.isOutlineOpen ? "Сховати структуру сторінки" : "Показати структуру сторінки"}
            aria-label="Структура сторінки"
          />
        </Flex>
        <Flex gap="middle" align="center">
          <Flex gap="small">
            <Tooltip title="Повернутись назад">
              <Button icon={isNarrow ? <ArrowLeftOutlined/> : undefined} onClick={() => back()} aria-label="Повернутись назад">
                {!isNarrow && "Повернутись назад"}
              </Button>
            </Tooltip>
            <ThemeSwitcher/>
            <Tooltip title="Відмінити зміни">
              <Button
                icon={isNarrow ? <UndoOutlined/> : undefined}
                onClick={() => props.cancelChanges()}
                disabled={!props.isChanged}
                aria-label="Відмінити зміни"
              >
                {!isNarrow && "Відмінити"}
              </Button>
            </Tooltip>
            <Button type="primary" onClick={() => props.saveChanges()} disabled={!props.isChanged}>
              Зберегти
            </Button>
          </Flex>
        </Flex>
      </Flex>
    </Layout.Header>
  );
}
