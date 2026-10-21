import {DragEvent, ReactNode, useRef, useState} from "react";
import {App, Flex, Typography} from "antd";
import {CloudUploadOutlined} from "@ant-design/icons";
import {useUploads} from "../../context/uploads-context";
import styles from "./file-drop-zone.module.scss";

interface IProps {
  children: ReactNode;
}

const hasFiles = (event: DragEvent) => event.dataTransfer.types.includes("Files");

export default function FileDropZone(props: IProps) {
  const {notification} = App.useApp();
  const {upload, isUploading} = useUploads();

  const [isOver, setIsOver] = useState<boolean>(false);
  const depth = useRef<number>(0);

  const onDragEnter = (event: DragEvent) => {
    if (!hasFiles(event))
      return;

    event.preventDefault();
    depth.current++;
    setIsOver(() => true);
  }

  const onDragOver = (event: DragEvent) => {
    if (!hasFiles(event))
      return;

    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
  }

  const onDragLeave = (event: DragEvent) => {
    if (!hasFiles(event))
      return;

    depth.current = Math.max(0, depth.current - 1);

    if (depth.current == 0)
      setIsOver(() => false);
  }

  const onDrop = (event: DragEvent) => {
    if (!hasFiles(event))
      return;

    event.preventDefault();
    depth.current = 0;
    setIsOver(() => false);

    const items = [...event.dataTransfer.items].filter((item) => item.kind == "file");
    const folders = items.filter((item) => item.webkitGetAsEntry()?.isDirectory).length;
    const files = items
      .filter((item) => !item.webkitGetAsEntry()?.isDirectory)
      .map((item) => item.getAsFile())
      .filter((file): file is File => file != null);

    if (folders != 0)
      notification.warning({
        title: "Папки не завантажуються",
        description: "Щоб завантажити папку з усім вмістом, запакуйте її в ZIP і скористайтеся «Імпорт»"
      });

    upload(files);
  }

  return (
    <div
      className={styles.zone}
      onDragEnter={onDragEnter}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      {props.children}
      {(isOver || isUploading) && (
        <Flex vertical align="center" justify="center" gap="small" className={styles.overlay}>
          <CloudUploadOutlined className={styles.icon}/>
          <Typography.Text strong>
            {isUploading ? "Завантаження..." : "Відпустіть, щоб завантажити в поточну папку"}
          </Typography.Text>
        </Flex>
      )}
    </div>
  )
}
