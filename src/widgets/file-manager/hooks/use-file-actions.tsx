import {useContext} from "react";
import {App} from "antd";
import type {IFileEntry} from "@/entities/file";
import {deleteFileEntriesAction, moveOrCopyFileEntriesAction} from "@/entities/file/actions/actions";
import {FileExplorerContext} from "@/entities/file/ui";
import {getFileDownloadUrl, getFilesArchiveUrl, getFileViewUrl} from "@/shared/utilities/file-urls";
import {unwrapServerAction} from "@/shared/utilities/unwrap-server-action";
import {EntryNameModalContext} from "../context/entry-name-modal-context";

const startDownload = (url: string) => {
  const link = document.createElement("a");
  link.href = url;
  link.download = "";
  link.click();
}

export function useFileActions() {
  const {notification, modal, message} = App.useApp();
  const {setSelectedEntries, setUpdateFiles} = useContext(FileExplorerContext);
  const {openRename} = useContext(EntryNameModalContext);

  const refresh = () => {
    setSelectedEntries(() => []);
    setUpdateFiles((value) => value + 1);
  }

  const rename = (entry: IFileEntry) => openRename(entry);

  const remove = (entries: IFileEntry[]) => {
    modal.confirm({
      title: entries.length == 1 ? `Видалити «${entries[0].name}»?` : `Видалити вибрані (${entries.length})?`,
      content: "Посилання на них на сторінках сайту перестануть працювати.",
      okText: "Видалити",
      okButtonProps: {danger: true},
      cancelText: "Відмінити",
      onOk: () => unwrapServerAction(deleteFileEntriesAction(entries.map((x) => x.slug)))
        .then(() => {
          notification.success({title: "Видалено"});
          refresh();
        })
        .catch((error) => notification.error({title: "Помилка видалення", description: error.message}))
    });
  }

  const move = (slugs: string[], targetSlug: string | null) => {
    unwrapServerAction(moveOrCopyFileEntriesAction(targetSlug, slugs, true))
      .then(() => {
        message.success(slugs.length == 1 ? "Переміщено" : `Переміщено: ${slugs.length}`);
        refresh();
      })
      .catch((error) => notification.error({title: "Помилка переміщення", description: error.message}));
  }

  const download = (entries: IFileEntry[]) => {
    startDownload(entries.length == 1 && entries[0].kind == "file" ?
      getFileDownloadUrl(entries[0].slug) :
      getFilesArchiveUrl(entries.map((x) => x.slug)));
  }

  const copyLink = (entry: IFileEntry) => {
    navigator.clipboard.writeText(window.location.origin + getFileViewUrl(entry.slug))
      .then(() => message.success("Посилання скопійовано"))
      .catch(() => message.error("Не вдалося скопіювати посилання"));
  }

  return {rename, remove, move, download, copyLink};
}
