import {useContext, useRef, useState} from "react";
import type {IFileEntry} from "@/entities/file";
import {FileExplorerContext} from "@/entities/file/ui";
import {postFormWithProgress} from "@/shared/utilities/post-form";
import {FILES_UPLOAD_URL} from "@/shared/utilities/file-urls";
import {IUploadItem, IUploadsContext} from "../context/uploads-context";

const PARALLEL_UPLOADS = 3;

export function useUploadsState(): IUploadsContext {
  const {currentFolder, setUpdateFiles} = useContext(FileExplorerContext);

  const [items, setItems] = useState<IUploadItem[]>([]);

  const queueRef = useRef<IUploadItem[]>([]);
  const controllersRef = useRef(new Map<string, AbortController>());

  const update = (id: string, patch: Partial<IUploadItem>) => {
    setItems((prevState) => prevState.map((item) => item.id == id ? {...item, ...patch} : item));
  }

  const pump = () => {
    while (controllersRef.current.size < PARALLEL_UPLOADS && queueRef.current.length != 0) {
      const item = queueRef.current.shift()!;
      const controller = new AbortController();
      controllersRef.current.set(item.id, controller);

      update(item.id, {status: "uploading"});

      const form = new FormData();
      form.append("file", item.file);

      if (item.folder)
        form.append("folder", item.folder);

      postFormWithProgress<IFileEntry>(FILES_UPLOAD_URL, form, {
        signal: controller.signal,
        onProgress: (loaded, total) => update(item.id, {loaded: Math.min(loaded, total, item.file.size)})
      })
        .then((result) => {
          if (controller.signal.aborted)
            update(item.id, {status: "cancelled"});
          else if (result.success)
            update(item.id, {status: "done", loaded: item.file.size});
          else
            update(item.id, {status: "error", error: result.errorMessage});
        })
        .finally(() => {
          controllersRef.current.delete(item.id);

          if (controllersRef.current.size == 0 && queueRef.current.length == 0)
            setUpdateFiles((value) => value + 1);

          pump();
        });
    }
  }

  const upload = (files: File[]) => {
    if (files.length == 0)
      return;

    const added = files.map((file): IUploadItem => ({
      id: crypto.randomUUID(),
      file,
      folder: currentFolder,
      loaded: 0,
      status: "waiting"
    }));

    queueRef.current.push(...added);
    setItems((prevState) => [...prevState, ...added]);
    pump();
  }

  const cancel = (id: string) => {
    const index = queueRef.current.findIndex((item) => item.id == id);

    if (index != -1) {
      queueRef.current.splice(index, 1);
      update(id, {status: "cancelled"});
      return;
    }

    controllersRef.current.get(id)?.abort();
  }

  const cancelAll = () => {
    for (const item of queueRef.current)
      update(item.id, {status: "cancelled"});

    queueRef.current = [];
    controllersRef.current.forEach((controller) => controller.abort());
  }

  const clear = () => {
    setItems((prevState) => prevState.filter((item) => item.status == "waiting" || item.status == "uploading"));
  }

  const isUploading = items.some((item) => item.status == "waiting" || item.status == "uploading");

  return {items, isUploading, upload, cancel, cancelAll, clear};
}
