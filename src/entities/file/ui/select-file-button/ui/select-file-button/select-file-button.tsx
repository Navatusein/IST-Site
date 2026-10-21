"use client"

import {useEffect, useState} from "react";
import {Button, Flex, Image, Tag, theme} from "antd";
import {IFileEntry, IFileTypes} from "../../../../types/type";
import {getFileEntryAction} from "../../../../actions/actions";
import {SelectFilesModal} from "../../../select-files-modal";
import {unwrapServerAction} from "@/shared/utilities/unwrap-server-action";
import {getFileAssetUrl} from "@/shared/utilities/file-urls";

interface IProps {
  filter?: IFileTypes[];
  value?: string | null;
  onChange?: (value: string | null) => void;
}

export default function SelectFileButton(props: IProps) {
  const {token: {borderRadiusSM}} = theme.useToken();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const [entry, setEntry] = useState<IFileEntry | null>(null);
  const [isMissing, setIsMissing] = useState<boolean>(false);

  useEffect(() => {
    if (!props.value) {
      setEntry(() => null);
      setIsMissing(() => false);
      return;
    }

    if (entry?.slug == props.value)
      return;

    let isCancelled = false;

    unwrapServerAction(getFileEntryAction(props.value))
      .then((value) => {
        if (isCancelled)
          return;

        setEntry(() => value);
        setIsMissing(() => value == null);
      })
      .catch(() => {
        if (!isCancelled)
          setIsMissing(() => true);
      });

    return () => {
      isCancelled = true;
    };
  }, [props.value]);

  const onSubmit = (entries: IFileEntry[]) => {
    const selected = entries[0] ?? null;

    setEntry(() => selected);
    setIsMissing(() => false);
    props.onChange?.(selected?.slug ?? null);
  }

  return (
    <Flex vertical gap="small">
      <SelectFilesModal
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        selectorType="radio"
        filter={props.filter}
        initialSelection={entry ? [entry] : []}
        onSubmit={onSubmit}
      />
      <Button block onClick={() => setIsModalOpen(true)}>
        Вибрати файл
      </Button>
      {props.value && (
        <Flex align="center" gap="small" style={{minWidth: 0}}>
          {!isMissing && entry?.type == "image" && (
            <Image
              src={getFileAssetUrl(entry.slug)}
              alt={entry.name}
              width={48}
              height={48}
              style={{objectFit: "cover", borderRadius: borderRadiusSM}}
            />
          )}
          <Tag
            color={isMissing ? "red" : "blue"}
            style={{maxWidth: "100%", overflow: "hidden", textOverflow: "ellipsis"}}
            closable
            onClose={() => onSubmit([])}
          >
            {isMissing ? "Файл не знайдено" : entry?.name ?? props.value}
          </Tag>
        </Flex>
      )}
    </Flex>
  )
}
