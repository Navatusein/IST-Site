import {Button, Flex, Progress, theme, Tooltip, Typography} from "antd";
import {CheckCircleFilled, CloseCircleFilled, CloseOutlined} from "@ant-design/icons";
import {IFileEntry} from "@/entities/file";
import {FileTypeIcon} from "@/entities/file/ui";
import formatFileSize from "@/shared/utilities/format-file-size";
import {IUploadItem} from "../../context/uploads-context";

function toEntry(file: File): IFileEntry {
  const dot = file.name.lastIndexOf(".");

  return {
    slug: "",
    name: file.name,
    kind: "file",
    type: "file",
    parentSlug: null,
    size: file.size,
    extension: dot > 0 ? file.name.slice(dot) : undefined
  };
}

export default function UploadRow(props: {item: IUploadItem, onCancel: () => void}) {
  const {token} = theme.useToken();
  const {item} = props;

  const percent = item.file.size ? Math.round(item.loaded / item.file.size * 100) : 100;
  const isActive = item.status == "waiting" || item.status == "uploading";

  return (
    <Flex align="center" gap="small" style={{padding: `${token.paddingXS}px 0`}}>
      <span style={{fontSize: 20, display: "flex"}}><FileTypeIcon file={toEntry(item.file)}/></span>
      <Flex vertical style={{flex: 1, minWidth: 0}}>
        <Typography.Text ellipsis title={item.file.name}>{item.file.name}</Typography.Text>
        {item.status == "uploading" ? (
          <Progress percent={percent} size="small" showInfo={false} style={{margin: 0}}/>
        ) : (
          <Typography.Text type={item.status == "error" ? "danger" : "secondary"} ellipsis style={{fontSize: 12}}>
            {item.status == "waiting" && `У черзі · ${formatFileSize(item.file.size)}`}
            {item.status == "done" && formatFileSize(item.file.size)}
            {item.status == "error" && (item.error ?? "Помилка")}
            {item.status == "cancelled" && "Скасовано"}
          </Typography.Text>
        )}
      </Flex>
      {item.status == "uploading" && <Typography.Text type="secondary" style={{fontSize: 12}}>{percent}%</Typography.Text>}
      {item.status == "done" && <CheckCircleFilled style={{color: token.colorSuccess, fontSize: 16}}/>}
      {item.status == "error" && <CloseCircleFilled style={{color: token.colorError, fontSize: 16}}/>}
      {isActive && (
        <Tooltip title="Скасувати">
          <Button type="text" size="small" icon={<CloseOutlined/>} onClick={props.onCancel} aria-label="Скасувати"/>
        </Tooltip>
      )}
    </Flex>
  )
}
