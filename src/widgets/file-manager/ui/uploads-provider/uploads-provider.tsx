"use client"

import {ReactNode} from "react";
import UploadProgressPanel from "../upload-progress-panel/upload-progress-panel";
import {UploadsContext} from "../../context/uploads-context";
import {useUploadsState} from "../../hooks/use-uploads-state";

export default function UploadsProvider(props: {children: ReactNode}) {
  const uploads = useUploadsState();

  return (
    <UploadsContext value={uploads}>
      {props.children}
      <UploadProgressPanel/>
    </UploadsContext>
  )
}
