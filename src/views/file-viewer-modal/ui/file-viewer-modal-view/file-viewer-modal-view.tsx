"use client"

import {FileViewer} from "@/features/file-viewer";
import {useRouter} from "next/navigation";
import {FullScreenModal} from "@/shared/ui-kit";

interface IProps {
  path: string;
}

export default function FileViewerModalView(props: IProps) {
  const router = useRouter();

  return (
    <FullScreenModal
      onCancel={() => {router.back()}}
      onOk={() => {router.back()}}
      destroyOnHidden={true}
      cancelButtonProps={{style: {display: "none"}}}
      open={true}
      width={"100%"}
    >
      <FileViewer filePath={props.path} style={{height: "100%", width: "100%"}} />
    </FullScreenModal>
  )
}
