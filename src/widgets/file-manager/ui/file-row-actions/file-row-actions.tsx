import {Button, Dropdown, MenuProps} from "antd";
import {
  CloudDownloadOutlined,
  DeleteOutlined,
  EyeOutlined,
  FolderOpenOutlined,
  FormOutlined,
  LinkOutlined,
  MoreOutlined
} from "@ant-design/icons";
import type {IFileEntry} from "@/entities/file";
import {useFileActions} from "../../model/use-file-actions";

interface IProps {
  entry: IFileEntry;
  openFolder: (slug: string) => void;
  preview: (entry: IFileEntry) => void;
}

export default function FileRowActions(props: IProps) {
  const {rename, remove, download, copyLink} = useFileActions();
  const {entry} = props;
  const isFile = entry.kind == "file";

  const items: MenuProps["items"] = [
    isFile ?
      {key: "open", icon: <EyeOutlined/>, label: "Переглянути", onClick: () => props.preview(entry)} :
      {key: "open", icon: <FolderOpenOutlined/>, label: "Відкрити", onClick: () => props.openFolder(entry.slug)},
    {key: "download", icon: <CloudDownloadOutlined/>, label: isFile ? "Завантажити" : "Завантажити ZIP", onClick: () => download([entry])},
    ...(isFile ? [{key: "link", icon: <LinkOutlined/>, label: "Копіювати посилання", onClick: () => copyLink(entry)}] : []),
    {key: "rename", icon: <FormOutlined/>, label: "Перейменувати", onClick: () => rename(entry)},
    {type: "divider"},
    {key: "delete", icon: <DeleteOutlined/>, label: "Видалити", danger: true, onClick: () => remove([entry])},
  ];

  return (
    <Dropdown menu={{items}} trigger={["click"]} placement="bottomRight">
      <Button type="text" size="small" icon={<MoreOutlined/>} aria-label="Дії"/>
    </Dropdown>
  )
}
