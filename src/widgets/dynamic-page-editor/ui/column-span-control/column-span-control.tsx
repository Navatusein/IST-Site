import {Button, Dropdown, Tooltip} from "antd";
import {DownOutlined} from "@ant-design/icons";
import {PageGroupColumnSpan} from "@/entities/dynamic-page";

interface IProps {
  value?: PageGroupColumnSpan;
  onChange: (value: PageGroupColumnSpan) => void;
}

export const COLUMN_SPAN_OPTIONS: {value: PageGroupColumnSpan, label: string, short: string}[] = [
  {value: "1/4", label: "Чверть", short: "¼"},
  {value: "1/3", label: "Третина", short: "⅓"},
  {value: "1/2", label: "Половина", short: "½"},
  {value: "2/3", label: "Дві третини", short: "⅔"},
  {value: "3/4", label: "Три чверті", short: "¾"},
  {value: "1", label: "Вся ширина", short: "1"},
];

export default function ColumnSpanControl(props: IProps) {
  const current = COLUMN_SPAN_OPTIONS.find((option) => option.value == props.value);

  return (
    <Dropdown
      trigger={["click"]}
      menu={{
        items: COLUMN_SPAN_OPTIONS.map((option) => ({key: option.value, label: `${option.short} · ${option.label}`})),
        selectable: true,
        selectedKeys: props.value ? [props.value] : [],
        onClick: ({key}) => props.onChange(key as PageGroupColumnSpan)
      }}
    >
      <Tooltip title="Ширина блоку в розмітці">
        <Button type="text" size="small" aria-label="Ширина блоку в розмітці">
          {current?.short ?? "Рівно"}
          <DownOutlined style={{fontSize: 10}}/>
        </Button>
      </Tooltip>
    </Dropdown>
  )
}
