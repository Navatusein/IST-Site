import {useContext, useState} from "react";
import {App} from "antd";
import {IFileEntry} from "@/entities/file";
import {FileExplorerContext} from "@/entities/file/ui";
import type {IFilesImportReport} from "@/entities/file/services/file-archive-service";
import {postForm} from "@/shared/utilities/post-form";
import {unwrapServerAction} from "@/shared/utilities/unwrap-server-action";
import {FILES_IMPORT_URL, getFilesArchiveUrl} from "@/shared/utilities/file-urls";

export function useFilesArchive() {
  const {notification, modal} = App.useApp();
  const {currentFolder, setSelectedEntries, setUpdateFiles} = useContext(FileExplorerContext);

  const [isImporting, setIsImporting] = useState<boolean>(false);

  const exportFiles = (entries: IFileEntry[]) => {
    const link = document.createElement("a");
    link.href = getFilesArchiveUrl(entries.map((entry) => entry.slug), true);
    link.download = "";
    link.click();

    setSelectedEntries(() => []);
  }

  const importArchive = (archive: File) => {
    setIsImporting(() => true);

    const form = new FormData();
    form.append("archive", archive);

    if (currentFolder)
      form.append("folder", currentFolder);

    unwrapServerAction(postForm<IFilesImportReport>(FILES_IMPORT_URL, form))
      .then((report) => {
        const parts = [
          report.createdFolders && `папок створено: ${report.createdFolders}`,
          report.createdFiles && `файлів додано: ${report.createdFiles}`,
          report.updatedFiles && `файлів оновлено: ${report.updatedFiles}`,
          report.renamed && `перейменовано через збіг назв: ${report.renamed}`
        ].filter(Boolean);

        notification.success({
          title: report.restored ? "Експорт відновлено" : "Архів розпаковано",
          description: parts.length != 0 ? parts.join(", ") : "Нічого не змінилось"
        });

        setUpdateFiles((value) => value + 1);
      })
      .catch((error) => notification.error({title: "Помилка імпорту", description: error.message}))
      .finally(() => setIsImporting(() => false));
  }

  const confirmImport = (archive: File) => {
    modal.confirm({
      title: `Імпортувати «${archive.name}»?`,
      content: "Експорт цього сайту повертає файли на свої місця і замінює їх вміст. " +
        "Звичайний ZIP-архів розпаковується в поточну папку.",
      okText: "Імпортувати",
      cancelText: "Скасувати",
      onOk: () => importArchive(archive)
    });

    return false;
  }

  return {exportFiles, confirmImport, isImporting};
}
