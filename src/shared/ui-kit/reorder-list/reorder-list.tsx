"use client"

import {Card, Flex, theme, Typography} from "antd";
import {DraggableList, moveItem} from "../draggable-list";
import {IRecordOrderItem} from "@/shared/types/record-order";

interface IProps {
  items: IRecordOrderItem[];
  onChange: (items: IRecordOrderItem[]) => void;
}

export default function ReorderList(props: IProps) {
  const {token: {paddingXS, colorTextSecondary, colorFillSecondary, colorBorderSecondary, fontSizeSM}} = theme.useToken();

  return (
    <DraggableList
      count={props.items.length}
      onReorder={(startIndex, finishIndex) => props.onChange(moveItem(props.items, startIndex, finishIndex))}
    >
      <Flex vertical gap={paddingXS}>
        {props.items.map((item, index) => (
          <DraggableList.Item
            key={item.id}
            index={index}
            gap={`${paddingXS}px`}
            renderPreview={() => (
              <Card size="small" style={{width: 280}}>
                <Typography.Text strong ellipsis>{item.title}</Typography.Text>
              </Card>
            )}
          >
            <Card size="small" styles={{body: {padding: paddingXS}}}>
              <Flex align="center" gap="small" style={{minWidth: 0}}>
                <DraggableList.Handle/>
                <Flex
                  align="center"
                  justify="center"
                  style={{flex: "none", minWidth: 24, height: 24, padding: "0 6px", borderRadius: 12, background: colorFillSecondary}}
                >
                  <Typography.Text style={{fontSize: fontSizeSM, color: colorTextSecondary}}>{index + 1}</Typography.Text>
                </Flex>
                <Flex vertical style={{flex: 1, minWidth: 0}}>
                  <Typography.Text strong ellipsis>{item.title}</Typography.Text>
                  {item.description && (
                    <Typography.Text type="secondary" ellipsis>{item.description}</Typography.Text>
                  )}
                </Flex>
              </Flex>
            </Card>
          </DraggableList.Item>
        ))}
      </Flex>
    </DraggableList>
  )
}
