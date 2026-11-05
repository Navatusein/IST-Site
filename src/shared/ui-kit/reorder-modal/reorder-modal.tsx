"use client"

import {useEffect, useRef, useState} from "react";
import {App, Empty, Flex, Modal, Spin, Typography} from "antd";
import ReorderList from "../reorder-list/reorder-list";
import {IRecordOrderGroup} from "@/shared/types/record-order";

interface IProps {
  open: boolean;
  title: string;
  description?: string;
  load: () => Promise<IRecordOrderGroup[]>;
  save: (ids: string[]) => Promise<void>;
  onClose: () => void;
  onSaved?: () => void;
}

export default function ReorderModal(props: IProps) {
  const {notification} = App.useApp();

  const [groups, setGroups] = useState<IRecordOrderGroup[] | null>(null);
  const [isChanged, setIsChanged] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const loadRef = useRef(props.load);
  loadRef.current = props.load;

  useEffect(() => {
    if (!props.open)
      return;

    let isCancelled = false;

    setGroups(() => null);
    setIsChanged(() => false);

    loadRef.current()
      .then((result) => {
        if (!isCancelled)
          setGroups(() => result);
      })
      .catch((error: unknown) => {
        if (isCancelled)
          return;

        notification.error({title: "Не вдалося завантажити список", description: (error as Error).message});
        props.onClose();
      });

    return () => {
      isCancelled = true;
    };
  }, [props.open]);

  const changeGroup = (key: string, items: IRecordOrderGroup["items"]) => {
    setGroups((prevState) => prevState?.map((group) => group.key == key ? {...group, items} : group) ?? null);
    setIsChanged(() => true);
  }

  const save = async () => {
    if (!groups)
      return;

    setIsSaving(() => true);

    try {
      await props.save(groups.flatMap((group) => group.items.map((item) => item.id)));
      notification.success({title: "Порядок збережено"});
      props.onSaved?.();
      props.onClose();
    }
    catch (error) {
      notification.error({title: "Не вдалося зберегти порядок", description: (error as Error).message});
    }
    finally {
      setIsSaving(() => false);
    }
  }

  const isEmpty = groups != null && groups.every((group) => group.items.length == 0);

  return (
    <Modal
      open={props.open}
      title={props.title}
      okText="Зберегти"
      cancelText="Відмінити"
      onOk={save}
      onCancel={() => !isSaving && props.onClose()}
      okButtonProps={{disabled: !isChanged, loading: isSaving}}
      cancelButtonProps={{disabled: isSaving}}
      mask={{closable: !isSaving}}
      destroyOnHidden
      width={640}
      styles={{body: {maxHeight: "65vh", overflowY: "auto"}}}
    >
      <Flex vertical gap="middle">
        {props.description && (
          <Typography.Text type="secondary">{props.description}</Typography.Text>
        )}
        {groups == null && (
          <Flex justify="center" style={{padding: 32}}>
            <Spin/>
          </Flex>
        )}
        {isEmpty && <Empty description="Немає записів"/>}
        {groups?.filter((group) => group.items.length != 0).map((group) => (
          <Flex vertical gap="small" key={group.key}>
            {group.title && <Typography.Title level={5} style={{margin: 0}}>{group.title}</Typography.Title>}
            <ReorderList items={group.items} onChange={(items) => changeGroup(group.key, items)}/>
          </Flex>
        ))}
      </Flex>
    </Modal>
  )
}
