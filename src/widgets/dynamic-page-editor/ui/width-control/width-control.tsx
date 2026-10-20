import {Button, Dropdown, Segmented, Tooltip} from "antd";
import {ColumnWidthOutlined, DownOutlined} from "@ant-design/icons";
import {PageEntityWidth} from "@/entities/dynamic-page";

interface IProps {
  value: PageEntityWidth;
  onChange: (value: PageEntityWidth) => void;
  allowedWidth?: PageEntityWidth[];
  compact?: boolean;
  tooltip: string;
}

const WIDTH_OPTIONS: {value: PageEntityWidth, label: string}[] = [
  {value: "large", label: "Великий"},
  {value: "medium", label: "Середній"},
  {value: "small", label: "Малий"},
];

export default function WidthControl(props: IProps) {
  const isAllowed = (width: PageEntityWidth) => props.allowedWidth?.includes(width) != false;

  if (props.compact)
    return (
      <Dropdown
        trigger={["click"]}
        menu={{
          items: WIDTH_OPTIONS.map((option) => ({key: option.value, label: option.label, disabled: !isAllowed(option.value)})),
          selectable: true,
          selectedKeys: [props.value],
          onClick: ({key}) => props.onChange(key as PageEntityWidth)
        }}
      >
        <Button icon={<ColumnWidthOutlined/>} aria-label={props.tooltip}>
          {WIDTH_OPTIONS.find((option) => option.value == props.value)?.label}
          <DownOutlined style={{fontSize: 10}}/>
        </Button>
      </Dropdown>
    );

  return (
    <Tooltip title={props.tooltip}>
      <Segmented
        options={WIDTH_OPTIONS.map((option) => ({...option, disabled: !isAllowed(option.value)}))}
        value={props.value}
        onChange={(value) => props.onChange(value as PageEntityWidth)}
      />
    </Tooltip>
  )
}
