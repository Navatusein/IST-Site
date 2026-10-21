import {App, Button, Flex, Grid, Layout, theme, Tooltip} from "antd";
import {Icon} from "@/shared/ui-kit";
import {useRouter} from "next/navigation";
import {ArrowLeftOutlined, EditOutlined, EyeOutlined, HistoryOutlined, MenuFoldOutlined, MenuUnfoldOutlined, SaveOutlined, UndoOutlined} from "@ant-design/icons";
import {ThemeSwitcher} from "@/features/theme-switcher";
import {MouseEvent} from "react";

interface IProps {
  isChanged: boolean;
  isSaving: boolean;
  saveChanges: () => void;
  cancelChanges: () => void;
  isOutlineOpen: boolean;
  toggleOutline: () => void;
  isPreview: boolean;
  togglePreview: () => void;
  openHistory?: () => void;
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

  const toAdmin = (event: MouseEvent) => {
    if (!props.isChanged)
      return;

    event.preventDefault();

    modal.confirm({
      title: "Перейти в адмінпанель",
      content: "У редакторі є незбережені зміни. Ви впевнені, що хочете вийти?",
      okText: "Так",
      cancelText: "Ні",
      onOk: () => {
        router.push("/admin");
      }
    });
  }

  return (
    <Layout.Header style={{padding: `0 8px 0 0`, background: colorBgContainer, position: "sticky", top: 0, zIndex: "1000"}}>
      <Flex justify="space-between" align="center" style={{height: "100%"}}>
        <Flex align="center" gap={isNarrow ? 0 : "small"}>
          <Icon
            showText={!isNarrow}
            iconSize={isNarrow ? 40 : undefined}
            style={isNarrow ? undefined : {width: 300}}
            href="/admin"
            onClick={toAdmin}
          />
          <Button
            type="text"
            icon={props.isOutlineOpen ? <MenuFoldOutlined/> : <MenuUnfoldOutlined/>}
            onClick={props.toggleOutline}
            title={props.isOutlineOpen ? "Сховати структуру сторінки" : "Показати структуру сторінки"}
            aria-label="Структура сторінки"
          />
        </Flex>
        <Flex gap="middle" align="center">
          <Flex gap={isNarrow ? 6 : "small"}>
            <Tooltip title="Повернутись назад">
              <Button icon={isNarrow ? <ArrowLeftOutlined/> : undefined} onClick={() => back()} aria-label="Повернутись назад">
                {!isNarrow && "Повернутись назад"}
              </Button>
            </Tooltip>
            {props.openHistory && (
              <Tooltip title="Збережені версії сторінки">
                <Button icon={<HistoryOutlined/>} onClick={props.openHistory} aria-label="Історія">
                  {!isNarrow && "Історія"}
                </Button>
              </Tooltip>
            )}
            <Tooltip title={props.isPreview ? "Повернутись до редагування" : "Переглянути сторінку без інструментів редактора"}>
              <Button
                icon={props.isPreview ? <EditOutlined/> : <EyeOutlined/>}
                onClick={props.togglePreview}
                aria-pressed={props.isPreview}
                aria-label={props.isPreview ? "Редагування" : "Перегляд"}
              >
                {!isNarrow && (props.isPreview ? "Редагування" : "Перегляд")}
              </Button>
            </Tooltip>
            <ThemeSwitcher/>
            <Tooltip title="Відмінити зміни">
              <Button
                icon={isNarrow ? <UndoOutlined/> : undefined}
                onClick={() => props.cancelChanges()}
                disabled={!props.isChanged || props.isSaving}
                aria-label="Відмінити зміни"
              >
                {!isNarrow && "Відмінити"}
              </Button>
            </Tooltip>
            <Tooltip title={isNarrow ? "Зберегти" : undefined}>
              <Button
                type="primary"
                icon={isNarrow ? <SaveOutlined/> : undefined}
                onClick={() => props.saveChanges()}
                disabled={!props.isChanged && !props.isSaving}
                loading={props.isSaving}
                aria-label="Зберегти"
              >
                {!isNarrow && "Зберегти"}
              </Button>
            </Tooltip>
          </Flex>
        </Flex>
      </Flex>
    </Layout.Header>
  );
}
