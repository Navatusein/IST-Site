"use client"

import {CSSProperties, useContext} from "react";
import {Button, ButtonProps, Dropdown, MenuProps} from "antd";
import {
  ArrowDownOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined,
  ArrowUpOutlined,
  HolderOutlined,
  VerticalAlignBottomOutlined,
  VerticalAlignTopOutlined
} from "@ant-design/icons";
import invariant from "tiny-invariant";
import {DraggableListContext, DraggableListItemContext} from "../../context/draggable-list-context";

interface IProps {
  type?: ButtonProps["type"];
  size?: ButtonProps["size"];
  style?: CSSProperties;
}

export default function DraggableHandle(props: IProps) {
  const list = useContext(DraggableListContext);
  const item = useContext(DraggableListItemContext);

  invariant(list && item, "DraggableList.Handle must be rendered inside DraggableList.Item");

  const isFirst = item.index == 0;
  const isLast = item.index >= list.count - 1;

  const menuItems: MenuProps["items"] = [
    {
      key: "first",
      label: "На початок",
      icon: <VerticalAlignTopOutlined/>,
      disabled: isFirst,
      onClick: () => list.reorder(item.index, 0)
    },
    {
      key: "previous",
      label: list.horizontal ? "Перемістити вліво" : "Перемістити вгору",
      icon: list.horizontal ? <ArrowLeftOutlined/> : <ArrowUpOutlined/>,
      disabled: isFirst,
      onClick: () => list.reorder(item.index, item.index - 1)
    },
    {
      key: "next",
      label: list.horizontal ? "Перемістити вправо" : "Перемістити вниз",
      icon: list.horizontal ? <ArrowRightOutlined/> : <ArrowDownOutlined/>,
      disabled: isLast,
      onClick: () => list.reorder(item.index, item.index + 1)
    },
    {
      key: "last",
      label: "В кінець",
      icon: <VerticalAlignBottomOutlined/>,
      disabled: isLast,
      onClick: () => list.reorder(item.index, list.count - 1)
    },
  ];

  return (
    <Dropdown menu={{items: menuItems}} trigger={["click"]} disabled={list.count < 2}>
      <Button
        ref={item.handleRef as never}
        type={props.type ?? "text"}
        size={props.size}
        icon={<HolderOutlined/>}
        title="Перетягніть або натисніть, щоб перемістити"
        aria-label="Перемістити"
        style={{cursor: item.isDragging ? "grabbing" : "grab", ...props.style}}
      />
    </Dropdown>
  )
}
