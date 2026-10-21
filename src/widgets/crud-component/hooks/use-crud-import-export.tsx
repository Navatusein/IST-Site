"use client"

import {ChangeEvent, useRef, useState} from "react";
import {App} from "antd";
import dayjs from "dayjs";
import {IImportReport} from "@/shared/types/import-export";
import downloadJson from "@/shared/utilities/download-json";
import {ICrudImportExport} from "../types/type";
import CrudImportModal from "../ui/crud-import-modal/crud-import-modal";

interface IOptions {
  config?: ICrudImportExport;
  selectedIds: string[];
  search?: string;
  onImported: () => void;
}

export function useCrudImportExport(options: IOptions) {
  const {notification} = App.useApp();

  const inputRef = useRef<HTMLInputElement>(null);

  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [isApplying, setIsApplying] = useState<boolean>(false);
  const [file, setFile] = useState<unknown>(null);
  const [report, setReport] = useState<IImportReport | null>(null);

  const exportRecords = async () => {
    if (!options.config)
      return;

    setIsExporting(() => true);

    try {
      const data = await options.config.exportRecords(
        options.selectedIds.length != 0 ? {ids: options.selectedIds} : {search: options.search}
      );

      downloadJson(data, `${options.config.fileName}-${dayjs().format("YYYY-MM-DD")}`);
      notification.success({title: `Експортовано записів: ${data.items.length}`});
    }
    catch (error) {
      notification.error({title: "Помилка експорту", description: (error as Error).message});
    }
    finally {
      setIsExporting(() => false);
    }
  }

  const openFilePicker = () => inputRef.current?.click();

  const onFileSelected = async (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    event.target.value = "";

    if (!selectedFile || !options.config)
      return;

    let data: unknown;

    try {
      data = JSON.parse(await selectedFile.text());
    }
    catch {
      notification.error({title: "Помилка імпорту", description: "Файл не є коректним JSON"});
      return;
    }

    try {
      setReport(await options.config.importRecords(data, false));
      setFile(() => data);
    }
    catch (error) {
      notification.error({title: "Помилка імпорту", description: (error as Error).message});
    }
  }

  const apply = async () => {
    if (!options.config || file == null)
      return;

    setIsApplying(() => true);

    try {
      setReport(await options.config.importRecords(file, true));
      options.onImported();
    }
    catch (error) {
      notification.error({title: "Помилка імпорту", description: (error as Error).message});
    }
    finally {
      setIsApplying(() => false);
    }
  }

  const close = () => {
    setReport(() => null);
    setFile(() => null);
  }

  const elements = options.config && (
    <>
      <input ref={inputRef} type="file" accept=".json,application/json" hidden onChange={onFileSelected}/>
      <CrudImportModal report={report} isApplying={isApplying} onApply={apply} onClose={close}/>
    </>
  );

  return {isEnabled: options.config != null, isExporting, exportRecords, openFilePicker, elements};
}
