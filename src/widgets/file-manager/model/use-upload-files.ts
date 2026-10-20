import {useContext, useState} from "react";
import {App} from "antd";
import type {IFileEntry} from "@/entities/file";
import {FileExplorerContext} from "@/entities/file/ui";
import {postForm} from "@/shared/utilities/post-form";
import {FILES_UPLOAD_URL} from "@/shared/utilities/file-urls";
import {unwrapServerAction} from "@/shared/utilities/unwrap-server-action";

const PARALLEL_UPLOADS = 3;

export function useUploadFiles() {
  const {notification} = App.useApp();
  const {currentFolder, setUpdateFiles} = useContext(FileExplorerContext);

  const [isUploading, setIsUploading] = useState<boolean>(false);

  const uploadFile = (file: File) => {
    const form = new FormData();
    form.append("file", file);

    if (currentFolder)
      form.append("folder", currentFolder);

    return unwrapServerAction(postForm<IFileEntry>(FILES_UPLOAD_URL, form));
  }

  const upload = async (files: File[]) => {
    if (files.length == 0)
      return;

    setIsUploading(() => true);

    const queue = [...files];
    const failed: string[] = [];
    let uploaded = 0;

    const worker = async () => {
      for (let file = queue.shift(); file; file = queue.shift()) {
        try {
          await uploadFile(file);
          uploaded++;
        }
        catch (error) {
          failed.push(`${file.name}: ${(error as Error).message}`);
        }
      }
    };

    await Promise.all(Array.from({length: Math.min(PARALLEL_UPLOADS, files.length)}, worker));

    setIsUploading(() => false);
    setUpdateFiles((value) => value + 1);

    if (uploaded != 0)
      notification.success({
        title: uploaded == 1 ? "Файл завантажено" : `Завантажено файлів: ${uploaded}`,
        description: files.length == 1 ? files[0].name : undefined
      });

    if (failed.length != 0)
      notification.error({title: "Не вдалося завантажити", description: failed.join("\n"), style: {whiteSpace: "pre-line"}});
  }

  return {upload, isUploading};
}
