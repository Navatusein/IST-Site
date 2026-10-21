import {useState} from "react";
import {Button, Flex, Progress, theme, Tooltip, Typography} from "antd";
import {CloseOutlined, DownOutlined, StopOutlined, UpOutlined} from "@ant-design/icons";
import {useUploads} from "../../context/uploads-context";
import UploadRow from "../upload-row/upload-row";

export default function UploadProgressPanel() {
  const {token} = theme.useToken();
  const {items, isUploading, cancel, cancelAll, clear} = useUploads();

  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  if (items.length == 0)
    return null;

  const finished = items.filter((item) => item.status == "done").length;
  const failed = items.filter((item) => item.status == "error").length;
  const counted = items.filter((item) => item.status != "cancelled");
  const totalSize = counted.reduce((sum, item) => sum + item.file.size, 0);
  const loadedSize = counted.reduce((sum, item) => sum + (item.status == "done" ? item.file.size : item.loaded), 0);
  const percent = totalSize ? Math.round(loadedSize / totalSize * 100) : 100;

  const title = isUploading ?
    `Завантаження ${finished} з ${counted.length}` :
    failed ? `Завантажено ${finished}, з помилками ${failed}` : `Завантажено файлів: ${finished}`;

  return (
    <Flex
      vertical
      style={{
        position: "fixed",
        right: token.paddingLG,
        bottom: token.paddingLG,
        zIndex: 1000,
        width: 380,
        maxWidth: `calc(100vw - ${2 * token.paddingLG}px)`,
        background: token.colorBgElevated,
        borderRadius: token.borderRadiusLG,
        border: `1px solid ${token.colorBorderSecondary}`,
        boxShadow: token.boxShadowSecondary,
        overflow: "hidden"
      }}
    >
      <Flex align="center" gap="small" style={{padding: `${token.paddingSM}px ${token.paddingSM}px ${token.paddingSM}px ${token.padding}px`}}>
        <Typography.Text strong style={{flex: 1}}>{title}</Typography.Text>
        {isUploading && (
          <Tooltip title="Скасувати всі">
            <Button type="text" size="small" icon={<StopOutlined/>} onClick={cancelAll} aria-label="Скасувати всі"/>
          </Tooltip>
        )}
        <Tooltip title={isCollapsed ? "Розгорнути" : "Згорнути"}>
          <Button
            type="text"
            size="small"
            icon={isCollapsed ? <UpOutlined/> : <DownOutlined/>}
            onClick={() => setIsCollapsed(!isCollapsed)}
            aria-label={isCollapsed ? "Розгорнути" : "Згорнути"}
          />
        </Tooltip>
        {!isUploading && (
          <Tooltip title="Закрити">
            <Button type="text" size="small" icon={<CloseOutlined/>} onClick={clear} aria-label="Закрити"/>
          </Tooltip>
        )}
      </Flex>
      {isUploading && (
        <Progress percent={percent} size="small" showInfo={false} style={{margin: `0 ${token.padding}px ${token.paddingXS}px`, width: "auto"}}/>
      )}
      {!isCollapsed && (
        <Flex
          vertical
          style={{
            maxHeight: 300,
            overflowY: "auto",
            padding: `0 ${token.padding}px ${token.paddingXS}px`,
            borderTop: `1px solid ${token.colorBorderSecondary}`
          }}
        >
          {items.map((item) => <UploadRow key={item.id} item={item} onCancel={() => cancel(item.id)}/>)}
        </Flex>
      )}
    </Flex>
  )
}
