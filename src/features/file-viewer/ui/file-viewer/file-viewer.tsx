"use client"

import {DocumentViewer} from "react-documents";
import normalizeUrl from "normalize-url";
import {CSSProperties} from "react";

interface IProps {
  filePath: string;
  style?: CSSProperties;
}

export default function FileViewer(props: IProps) {
  return (
    <DocumentViewer
      style={props.style}
      queryParams="hl=Nl"
      url={normalizeUrl(`${window.location.origin}/api/assets/${props.filePath}`)}
      viewerUrl="https://docs.google.com/gview?url=%URL%&embedded=true"
      viewer="url"
    />
  )
}
