"use client"

import {MouseEvent, ReactNode, useContext, useEffect, useRef, useState} from "react";
import {Button, Card, Collapse, Flex, Form, FormListFieldData, FormListOperation, theme, Tooltip, Typography} from "antd";
import {DeleteOutlined, DownOutlined, ExclamationCircleFilled, PlusOutlined, UpOutlined} from "@ant-design/icons";
import {DraggableList} from "../draggable-list";
import {EditorFormHostContext} from "../editor-form/editor-form-host";

interface IProps<T> {
  listName: string;
  fields: FormListFieldData[];
  operations: FormListOperation;
  getTitle: (item: T | undefined, index: number) => string;
  renderFields: (field: FormListFieldData) => ReactNode;
  renderPreview?: (item: T | undefined, index: number) => ReactNode;
  addLabel: string;
  createItem?: () => T;
  extraActions?: ReactNode;
}

const stopPropagation = (event: MouseEvent) => event.stopPropagation();

export default function FormSortableList<T>(props: IProps<T>) {
  const {token: {paddingXS, colorError}} = theme.useToken();

  const form = Form.useFormInstance();
  const host = useContext(EditorFormHostContext);

  const items = Form.useWatch<T[]>(props.listName) ?? [];

  const [openKeys, setOpenKeys] = useState<Set<number>>(() => new Set());
  const knownKeysRef = useRef<Set<number> | null>(null);

  const fieldKeys = props.fields.map((field) => field.key);

  const hasErrors = (field: FormListFieldData) => form.getFieldsError().some(({name, errors}) => (
    errors.length != 0 && name[0] == props.listName && name[1] == field.name
  ));

  useEffect(() => {
    const knownKeys = knownKeysRef.current;
    knownKeysRef.current = new Set(fieldKeys);

    if (knownKeys == null)
      return;

    const addedKeys = fieldKeys.filter((key) => !knownKeys.has(key));

    if (addedKeys.length != 0)
      setOpenKeys((prevState) => new Set([...prevState, ...addedKeys]));
  }, [fieldKeys.join()]);

  useEffect(() => {
    if (!host?.failedValidations)
      return;

    const keysWithErrors = props.fields.filter(hasErrors).map((field) => field.key);
    setOpenKeys((prevState) => new Set([...prevState, ...keysWithErrors]));
  }, [host?.failedValidations]);

  const toggle = (key: number) => {
    setOpenKeys((prevState) => {
      const next = new Set(prevState);

      if (!next.delete(key))
        next.add(key);

      return next;
    });
  }

  const renderItem = (field: FormListFieldData, index: number) => {
    const isInvalid = hasErrors(field);

    return (
      <Collapse
        size="small"
        style={isInvalid ? {borderColor: colorError} : undefined}
        activeKey={openKeys.has(field.key) ? [field.key] : []}
        onChange={() => toggle(field.key)}
        items={[{
          key: field.key,
          forceRender: true,
          label: (
            <Flex align="center" gap="small" style={{minWidth: 0}}>
              <span onClick={stopPropagation}>
                <DraggableList.Handle/>
              </span>
              <Typography.Text strong ellipsis type={isInvalid ? "danger" : undefined} style={{flex: 1, minWidth: 0}}>
                {props.getTitle(items[index], index)}
              </Typography.Text>
              {isInvalid && (
                <Tooltip title="Є незаповнені обов'язкові поля">
                  <ExclamationCircleFilled style={{color: colorError}}/>
                </Tooltip>
              )}
            </Flex>
          ),
          extra: (
            <Tooltip title="Видалити">
              <Button
                type="text"
                size="small"
                danger
                icon={<DeleteOutlined/>}
                onClick={(event) => {
                  stopPropagation(event);
                  props.operations.remove(field.name);
                }}
              />
            </Tooltip>
          ),
          children: (
            <Flex vertical gap="small">
              {props.renderFields(field)}
            </Flex>
          ),
          styles: {header: {alignItems: "center"}}
        }]}
      />
    );
  }

  return (
    <Flex vertical gap="small">
      {props.fields.length > 1 && (
        <Flex justify="flex-end" gap="small">
          <Button size="small" type="text" icon={<DownOutlined/>} onClick={() => setOpenKeys(() => new Set(fieldKeys))}>
            Розгорнути всі
          </Button>
          <Button size="small" type="text" icon={<UpOutlined/>} onClick={() => setOpenKeys(() => new Set())}>
            Згорнути всі
          </Button>
        </Flex>
      )}
      <DraggableList
        count={props.fields.length}
        onReorder={(startIndex, finishIndex) => props.operations.move(startIndex, finishIndex)}
      >
        <Flex vertical gap={paddingXS}>
          {props.fields.map((field, index) => (
            <DraggableList.Item
              key={field.key}
              index={index}
              gap={`${paddingXS}px`}
              renderPreview={() => props.renderPreview?.(items[index], index) ?? (
                <Card size="small" style={{width: 280}}>
                  <Typography.Text strong ellipsis>{props.getTitle(items[index], index)}</Typography.Text>
                </Card>
              )}
            >
              <Form.Item noStyle shouldUpdate>
                {() => renderItem(field, index)}
              </Form.Item>
            </DraggableList.Item>
          ))}
        </Flex>
      </DraggableList>
      <Flex gap="small" wrap>
        {props.extraActions && <div style={{flex: "1 1 200px", display: "flex"}}>{props.extraActions}</div>}
        <Button
          type="dashed"
          icon={<PlusOutlined/>}
          style={{flex: "1 1 200px"}}
          onClick={() => props.operations.add(props.createItem?.())}
        >
          {props.addLabel}
        </Button>
      </Flex>
    </Flex>
  )
}
