import {useContext, useEffect, useState} from "react";
import {Flex, Progress, theme, Tooltip, Typography} from "antd";
import {IStorageUsage} from "@/entities/file";
import {FileExplorerContext} from "@/entities/file/ui";
import {getStorageUsageAction} from "@/entities/file/actions/actions";
import {unwrapServerAction} from "@/shared/utilities/unwrap-server-action";
import formatFileSize from "@/shared/utilities/format-file-size";
import {HddOutlined} from "@ant-design/icons";

const WARNING_PERCENT = 80;
const DANGER_PERCENT = 95;

export default function StorageUsage() {
  const {token} = theme.useToken();
  const {updateFiles} = useContext(FileExplorerContext);

  const [usage, setUsage] = useState<IStorageUsage | null>(null);

  useEffect(() => {
    let isCancelled = false;

    unwrapServerAction(getStorageUsageAction())
      .then((result) => {
        if (!isCancelled)
          setUsage(() => result);
      })
      .catch(() => undefined);

    return () => {
      isCancelled = true;
    };
  }, [updateFiles]);

  if (!usage)
    return null;

  const files = `Файли: ${formatFileSize(usage.filesSize)}`;
  const hasDisk = usage.diskTotal != null && usage.diskFree != null && usage.diskTotal != 0;

  const used = hasDisk ? usage.diskTotal! - usage.diskFree! : 0;
  const percent = hasDisk ? Math.round(used / usage.diskTotal! * 100) : 0;
  const palette = percent >= DANGER_PERCENT ?
    {color: token.colorError, background: token.colorErrorBg, border: token.colorErrorBorder} :
    percent >= WARNING_PERCENT ?
      {color: token.colorWarning, background: token.colorWarningBg, border: token.colorWarningBorder} :
      {color: token.colorPrimary, background: token.colorPrimaryBg, border: token.colorPrimaryBorder};

  return (
    <Tooltip title={hasDisk ?
      `${usage.filesCount} файлів сайту. Диск сервера: зайнято ${percent}%, вільно ${formatFileSize(usage.diskFree!)} з ${formatFileSize(usage.diskTotal!)}` :
      `${usage.filesCount} файлів сайту`}
    >
      <Flex
        align="center"
        gap={token.paddingXS}
        style={{
          background: palette.background,
          border: `1px solid ${palette.border}`,
          borderRadius: token.borderRadiusLG,
          padding: `${token.paddingXXS}px ${token.paddingSM}px`
        }}
      >
        <HddOutlined style={{color: palette.color, fontSize: token.fontSizeLG}}/>
        <Typography.Text>{files}</Typography.Text>
        {hasDisk && (
          <Progress type="circle" percent={percent} size={16} strokeColor={palette.color} showInfo={false} aria-label="Зайнято на диску"/>
        )}
      </Flex>
    </Tooltip>
  )
}
