"use client"

import type {IFileEntry} from "@/entities/file";
import {FileExplorer} from "@/entities/file/ui";
import FileRowActions from "../file-row-actions/file-row-actions";
import {useFileActions} from "../../hooks/use-file-actions";

interface IProps {
  openFolder: (slug: string) => void;
  preview: (entry: IFileEntry) => void;
}

export default function FileManagerExplorer(props: IProps) {
  const {move} = useFileActions();

  return (
    <FileExplorer
      onPreview={props.preview}
      onMove={move}
      renderActions={(entry) => <FileRowActions entry={entry} openFolder={props.openFolder} preview={props.preview}/>}
    />
  )
}
