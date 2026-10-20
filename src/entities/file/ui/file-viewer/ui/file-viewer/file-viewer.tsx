"use client"

import {DocumentViewer} from "react-documents";
import {CSSProperties} from "react";
import {Button, Flex, Result, Spin} from "antd";

interface IProps {
  file: string;
  style?: CSSProperties;
}

export default function FileViewer(props: IProps) {
  const assetPath = props.file.split("/").filter(Boolean).map(encodeURIComponent).join("/");

  return (
    <DocumentViewer
      style={props.style}
      queryParams="hl=uk"
      url={`${window.location.origin}/api/assets/${assetPath}`}
      viewerUrl="https://docs.google.com/gview?url=%URL%&embedded=true"
      viewer="url"
      loadingRenderer={<Spin size="large" description="Завантаження документа..."/>}
      errorRenderer={(context) => (
        <Result
          status="warning"
          title="Не вдалося показати документ"
          extra={(
            <Flex gap="small" justify="center" wrap>
              <Button type="primary" onClick={context.retry}>Спробувати ще</Button>
              <Button href={context.actionUrl || context.url} target="_blank">Відкрити файл</Button>
            </Flex>
          )}
        />
      )}
    />
  )
}
