import {isValidObjectId, Model} from "mongoose";
import {
  EXPORT_FORMAT,
  EXPORT_VERSION,
  IExportFile,
  IExportParams,
  IImportReport,
  MAX_IMPORT_ITEMS
} from "@/shared/types/import-export";
import {ServerActionError} from "@/shared/exceptions/server-action-error";
import {buildSearchFilter} from "@/shared/services/pagination-service/pagination-service";
import toPlainObject from "@/shared/utilities/to-plain-object";

const SERVICE_FIELDS = ["__v", "createdAt", "updatedAt"];

export interface IExportOptions {
  searchFields: string[];
  excludeFields?: string[];
}

export interface IImportOptions {
  apply: boolean;
  matchFields?: string[];
  ignoreFields?: string[];
  getName: (item: Record<string, unknown>) => string | undefined;
  getWarnings?: (stats: {created: number, updated: number}) => string[];
}

export async function exportRecords<T>(model: Model<any>, entity: string, params: IExportParams, options: IExportOptions): Promise<IExportFile<T>> {
  const ids = (params.ids ?? []).filter((id) => isValidObjectId(id));
  const filter = ids.length != 0 ? {_id: {$in: ids}} : buildSearchFilter(params.search, options.searchFields);

  const projection = Object.fromEntries([...SERVICE_FIELDS, ...(options.excludeFields ?? [])].map((field) => [field, 0]));
  const items = await model.find(filter, projection).sort({_id: 1}).lean();

  return {
    format: EXPORT_FORMAT,
    version: EXPORT_VERSION,
    entity,
    exportedAt: new Date().toISOString(),
    items: toPlainObject<T[]>(items as T[])
  };
}

function readExportFile(file: unknown, entity: string): Record<string, unknown>[] {
  const data = file as Partial<IExportFile>;

  if (data == null || typeof data != "object" || data.format != EXPORT_FORMAT || !Array.isArray(data.items))
    throw new ServerActionError("Файл не є експортом цього сайту");

  if (data.entity != entity)
    throw new ServerActionError(`Файл містить дані іншої таблиці («${data.entity}»)`);

  if (typeof data.version != "number" || data.version > EXPORT_VERSION)
    throw new ServerActionError("Файл створено новішою версією сайту");

  if (data.items.length > MAX_IMPORT_ITEMS)
    throw new ServerActionError(`Забагато записів у файлі (більше ${MAX_IMPORT_ITEMS})`);

  return data.items as Record<string, unknown>[];
}

export async function importRecords(model: Model<any>, entity: string, file: unknown, options: IImportOptions): Promise<IImportReport> {
  const items = readExportFile(file, entity);
  const report: IImportReport = {applied: options.apply, total: items.length, created: 0, updated: 0, errors: [], warnings: []};

  const ignored = new Set([...SERVICE_FIELDS, ...(options.ignoreFields ?? [])]);

  for (const [index, rawItem] of items.entries()) {
    const name = rawItem && typeof rawItem == "object" ? options.getName(rawItem) : undefined;

    try {
      if (!rawItem || typeof rawItem != "object" || Array.isArray(rawItem))
        throw new Error("Запис має бути об'єктом");

      const {_id: rawId, ...fields} = Object.fromEntries(Object.entries(rawItem).filter(([key]) => !ignored.has(key)));
      const id = isValidObjectId(rawId) ? String(rawId) : undefined;

      let existing = id ? await model.findById(id) : null;

      for (const field of options.matchFields ?? []) {
        if (existing || fields[field] == null)
          continue;

        existing = await model.findOne({[field]: fields[field]});
      }

      if (existing) {
        existing.set(fields);
        await existing.validate();

        if (options.apply)
          await existing.save();

        report.updated++;
      }
      else {
        const document = new model(id ? {...fields, _id: id} : fields);
        await document.validate();

        if (options.apply)
          await document.save();

        report.created++;
      }
    }
    catch (error) {
      report.errors.push({row: index + 1, name, message: readableError(error)});
    }
  }

  report.warnings = options.getWarnings?.({created: report.created, updated: report.updated}) ?? [];

  return report;
}

function readableError(error: unknown): string {
  const validationErrors = (error as {errors?: Record<string, {message: string}>}).errors;

  if (validationErrors)
    return Object.values(validationErrors).map((x) => x.message).join("; ");

  if ((error as {code?: number}).code == 11000)
    return "Запис з таким унікальним значенням (наприклад, шляхом) вже існує";

  return (error as Error).message ?? "Невідома помилка";
}
