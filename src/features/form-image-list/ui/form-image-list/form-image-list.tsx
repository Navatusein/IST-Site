"use client"

import {ReactNode, useState} from "react";
import {Button, Form, FormListFieldData, FormListOperation} from "antd";
import {NamePath} from "antd/es/form/interface";
import {PictureOutlined} from "@ant-design/icons";
import type {IFileEntry} from "@/entities/file";
import {SelectFileButton, SelectFilesModal} from "@/entities/file/ui";
import {FormSortableList} from "@/shared/ui-kit";
import ImageDragPreview from "../image-drag-preview/image-drag-preview";

interface IProps<T> {
  listName: string;
  fields: FormListFieldData[];
  operations: FormListOperation;
  imageName: (name: number) => NamePath;
  createItem: (imageSlug: string | null) => T;
  getImageSlug: (item?: T) => string | null | undefined;
  getTitle?: (item?: T) => string | undefined;
  renderExtraFields?: (field: FormListFieldData) => ReactNode;
}

export default function FormImageList<T>(props: IProps<T>) {
  const [isSelectModalOpen, setIsSelectModalOpen] = useState<boolean>(false);

  const addImages = (entries: IFileEntry[]) => {
    entries.forEach((entry) => props.operations.add(props.createItem(entry.slug)));
  }

  const getTitle = (item: T | undefined, index: number) => props.getTitle?.(item) || `Фото ${index + 1}`;

  return (
    <>
      <FormSortableList<T>
        listName={props.listName}
        fields={props.fields}
        operations={props.operations}
        getTitle={getTitle}
        renderFields={(field) => (
          <>
            <Form.Item name={props.imageName(field.name)} style={{marginBottom: 0}}>
              <SelectFileButton filter={["image"]}/>
            </Form.Item>
            {props.renderExtraFields?.(field)}
          </>
        )}
        renderPreview={(item, index) => (
          <ImageDragPreview imageSlug={props.getImageSlug(item)} title={getTitle(item, index)}/>
        )}
        addLabel="Додати фото"
        createItem={() => props.createItem(null)}
        extraActions={
          <Button type="dashed" block icon={<PictureOutlined/>} onClick={() => setIsSelectModalOpen(true)}>
            Додати кілька фото
          </Button>
        }
      />
      <SelectFilesModal
        isOpen={isSelectModalOpen}
        setIsOpen={setIsSelectModalOpen}
        selectorType="checkbox"
        filter={["image"]}
        initialSelection={[]}
        onSubmit={addImages}
      />
    </>
  )
}
