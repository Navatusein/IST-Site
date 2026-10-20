import * as fs from "node:fs";
import * as fsp from "node:fs/promises";
import path from "node:path";
import mime from "mime";
import {strFromU8, strToU8, unzipSync, Zip, ZipDeflate, ZipPassThrough} from "fflate";
import {ServerActionError} from "@/shared/exceptions/server-action-error";
import FileEntryModel from "../types/schema";
import {IFileEntryDocument} from "../types/type";
import {FileManagerService, generateFileSlug} from "./file-manager-service";

export const MANIFEST_NAME = ".ist-files.json";
const MANIFEST_FORMAT = "ist-site-files";

const MAX_IMPORT_ENTRIES = 5000;
const MAX_IMPORT_SIZE = 1024 * 1024 * 1024;

interface IArchiveEntry {
  document: IFileEntryDocument;
  path: string;
}

interface IManifestEntry {
  slug: string;
  kind: "file" | "directory";
  name: string;
  parentSlug: string | null;
  path: string;
}

interface IManifest {
  format: typeof MANIFEST_FORMAT;
  version: 1;
  exportedAt: string;
  entries: IManifestEntry[];
}

export interface IFilesImportReport {
  restored: boolean;
  createdFiles: number;
  updatedFiles: number;
  createdFolders: number;
  renamed: number;
}

const isCompressible = (document: IFileEntryDocument) => {
  const type = document.mimeType ?? "";
  return type.startsWith("text/") || /json|xml|svg|javascript|rtf|msword|vnd\.ms-/.test(type);
};

export class FileArchiveService {
  public static async collect(slugs: string[] | null): Promise<IArchiveEntry[]> {
    const roots = await FileEntryModel
      .find(slugs ? {slug: {$in: slugs}} : {parentSlug: null})
      .lean<IFileEntryDocument[]>();

    const result: IArchiveEntry[] = [];
    let level = roots.map((document) => ({document, path: document.name}));

    while (level.length != 0) {
      result.push(...level);

      const folders = level.filter((x) => x.document.kind == "directory");
      const folderPaths = new Map(folders.map((x) => [x.document.slug, x.path]));

      const children = folders.length != 0 ?
        await FileEntryModel.find({parentSlug: {$in: [...folderPaths.keys()]}}).lean<IFileEntryDocument[]>() :
        [];

      level = children.map((document) => ({document, path: `${folderPaths.get(document.parentSlug!)}/${document.name}`}));
    }

    return result;
  }

  public static createArchiveStream(entries: IArchiveEntry[], withManifest: boolean): ReadableStream<Uint8Array> {
    return new ReadableStream<Uint8Array>({
      start: async (controller) => {
        const zip = new Zip((error, chunk, final) => {
          if (error)
            return controller.error(error);

          controller.enqueue(chunk);

          if (final)
            controller.close();
        });

        try {
          for (const {document, path: entryPath} of entries) {
            if (document.kind == "directory") {
              const folder = new ZipPassThrough(entryPath + "/");
              zip.add(folder);
              folder.push(new Uint8Array(0), true);
              continue;
            }

            const storagePath = document.storageName ? FileManagerService.getStoragePath(document.storageName) : null;

            if (!storagePath || !fs.existsSync(storagePath))
              continue;

            const file = isCompressible(document) ? new ZipDeflate(entryPath, {level: 6}) : new ZipPassThrough(entryPath);
            zip.add(file);

            for await (const chunk of fs.createReadStream(storagePath))
              file.push(new Uint8Array(chunk as Buffer));

            file.push(new Uint8Array(0), true);
          }

          if (withManifest) {
            const manifest: IManifest = {
              format: MANIFEST_FORMAT,
              version: 1,
              exportedAt: new Date().toISOString(),
              entries: entries.map(({document, path: entryPath}) => ({
                slug: document.slug,
                kind: document.kind,
                name: document.name,
                parentSlug: document.parentSlug,
                path: entryPath
              }))
            };

            const file = new ZipDeflate(MANIFEST_NAME, {level: 6});
            zip.add(file);
            file.push(strToU8(JSON.stringify(manifest, null, 2)), true);
          }

          zip.end();
        }
        catch (error) {
          zip.terminate();
          controller.error(error);
        }
      }
    });
  }

  public static async import(targetSlug: string | null, archive: Uint8Array): Promise<IFilesImportReport> {
    if (targetSlug != null && !await FileEntryModel.exists({slug: targetSlug, kind: "directory"}))
      throw new ServerActionError("Папку не знайдено");

    let count = 0;
    let totalSize = 0;
    let files: Record<string, Uint8Array>;

    try {
      files = unzipSync(archive, {
        filter: (file) => {
          count++;
          totalSize += file.originalSize;

          if (count > MAX_IMPORT_ENTRIES || totalSize > MAX_IMPORT_SIZE)
            throw new ServerActionError(`Архів завеликий: не більше ${MAX_IMPORT_ENTRIES} файлів і 1 ГБ`);

          return true;
        }
      });
    }
    catch (error) {
      if (error instanceof ServerActionError)
        throw error;

      throw new ServerActionError("Файл не є ZIP-архівом або пошкоджений");
    }

    const manifestData = files[MANIFEST_NAME];
    delete files[MANIFEST_NAME];

    const manifest = manifestData ? this.parseManifest(manifestData) : null;

    return manifest ?
      this.restore(targetSlug, manifest, files) :
      this.unpack(targetSlug, files);
  }

  private static parseManifest(data: Uint8Array): IManifest | null {
    try {
      const manifest = JSON.parse(strFromU8(data)) as IManifest;
      return manifest?.format == MANIFEST_FORMAT && Array.isArray(manifest.entries) ? manifest : null;
    }
    catch {
      return null;
    }
  }

  private static async restore(targetSlug: string | null, manifest: IManifest, files: Record<string, Uint8Array>): Promise<IFilesImportReport> {
    const report: IFilesImportReport = {restored: true, createdFiles: 0, updatedFiles: 0, createdFolders: 0, renamed: 0};

    const manifestSlugs = new Set(manifest.entries.map((x) => x.slug));

    const entries = [...manifest.entries]
      .filter((x) => typeof x.slug == "string" && /^[a-z0-9]{1,32}$/.test(x.slug) && (x.kind == "file" || x.kind == "directory"))
      .sort((a, b) => a.path.split("/").length - b.path.split("/").length);

    const existingKinds = new Map(
      (await FileEntryModel.find({slug: {$in: entries.map((x) => x.slug)}}, {slug: 1, kind: 1}).lean<IFileEntryDocument[]>())
        .map((x) => [x.slug, x.kind])
    );

    for (const entry of entries) {
      FileManagerService.validateName(entry.name);

      const kind = existingKinds.get(entry.slug);

      if (kind && kind != entry.kind)
        throw new ServerActionError(`"${entry.path}": у сховищі вже є ${kind == "file" ? "файл" : "папка"} з цим ідентифікатором`);
    }

    for (const entry of entries) {
      const name = FileManagerService.validateName(entry.name);

      const isParentKnown = entry.parentSlug == null ||
        manifestSlugs.has(entry.parentSlug) ||
        await FileEntryModel.exists({slug: entry.parentSlug, kind: "directory"}) != null;
      const parentSlug = isParentKnown ? entry.parentSlug : targetSlug;

      const existing = await FileEntryModel.findOne({slug: entry.slug}).lean<IFileEntryDocument>();

      const freeName = await this.getFreeName(parentSlug, name, entry.slug);

      if (freeName != name)
        report.renamed++;

      if (entry.kind == "directory") {
        if (existing)
          await FileEntryModel.updateOne({slug: entry.slug}, {$set: {name: freeName, parentSlug}});
        else {
          await FileEntryModel.create({slug: entry.slug, name: freeName, kind: "directory", parentSlug});
          report.createdFolders++;
        }

        continue;
      }

      const content = files[entry.path];

      if (!content)
        continue;

      const storageName = existing?.storageName ?? entry.slug + path.extname(name).toLowerCase();
      await this.writeContent(storageName, content);

      const fields = {name: freeName, parentSlug, storageName, mimeType: mime.getType(name) ?? "application/octet-stream", size: content.length};

      if (existing) {
        await FileEntryModel.updateOne({slug: entry.slug}, {$set: fields});
        report.updatedFiles++;
      }
      else {
        await FileEntryModel.create({slug: entry.slug, kind: "file", ...fields});
        report.createdFiles++;
      }
    }

    return report;
  }

  private static async unpack(targetSlug: string | null, files: Record<string, Uint8Array>): Promise<IFilesImportReport> {
    const report: IFilesImportReport = {restored: false, createdFiles: 0, updatedFiles: 0, createdFolders: 0, renamed: 0};

    const paths = Object.keys(files)
      .filter((rawPath) => !/(^|\/)(__MACOSX|\.DS_Store|Thumbs\.db)(\/|$)/.test(rawPath))
      .map((rawPath) => rawPath.replace(/\\/g, "/").replace(/^\/+|\/+$/g, ""))
      .filter(Boolean);

    for (const entryPath of paths)
      entryPath.split("/").forEach((segment) => FileManagerService.validateName(segment));

    const folders = new Map<string, string | null>([["", targetSlug]]);

    const ensureFolder = async (folderPath: string): Promise<string | null> => {
      if (folders.has(folderPath))
        return folders.get(folderPath)!;

      const parentPath = folderPath.includes("/") ? folderPath.slice(0, folderPath.lastIndexOf("/")) : "";
      const parentSlug = await ensureFolder(parentPath);
      const name = FileManagerService.validateName(folderPath.slice(folderPath.lastIndexOf("/") + 1));

      const existing = await FileEntryModel.findOne({parentSlug, name, kind: "directory"}).lean<IFileEntryDocument>();
      let slug = existing?.slug;

      if (!slug) {
        slug = generateFileSlug();
        await FileEntryModel.create({slug, name: await this.getFreeName(parentSlug, name), kind: "directory", parentSlug});
        report.createdFolders++;
      }

      folders.set(folderPath, slug);
      return slug;
    };

    for (const [rawPath, content] of Object.entries(files)) {
      if (/(^|\/)(__MACOSX|\.DS_Store|Thumbs\.db)(\/|$)/.test(rawPath))
        continue;

      const entryPath = rawPath.replace(/\\/g, "/").replace(/^\/+|\/+$/g, "");

      if (!entryPath)
        continue;

      if (rawPath.endsWith("/")) {
        await ensureFolder(entryPath);
        continue;
      }

      const folderPath = entryPath.includes("/") ? entryPath.slice(0, entryPath.lastIndexOf("/")) : "";
      const parentSlug = await ensureFolder(folderPath);
      const name = FileManagerService.validateName(entryPath.slice(entryPath.lastIndexOf("/") + 1));
      const freeName = await this.getFreeName(parentSlug, name);

      if (freeName != name)
        report.renamed++;

      const slug = generateFileSlug();
      const storageName = slug + path.extname(name).toLowerCase();
      await this.writeContent(storageName, content);

      await FileEntryModel.create({
        slug,
        name: freeName,
        kind: "file",
        parentSlug,
        storageName,
        mimeType: mime.getType(name) ?? "application/octet-stream",
        size: content.length
      });

      report.createdFiles++;
    }

    return report;
  }

  private static async writeContent(storageName: string, content: Uint8Array): Promise<void> {
    await fsp.mkdir(FileManagerService.storageDirectory, {recursive: true});
    await fsp.writeFile(FileManagerService.getStoragePath(storageName), content);
  }

  private static async getFreeName(parentSlug: string | null, name: string, ownSlug?: string): Promise<string> {
    const isTaken = async (candidate: string) => FileEntryModel.exists({parentSlug, name: candidate, slug: {$ne: ownSlug ?? ""}});

    if (!await isTaken(name))
      return name;

    const extension = path.extname(name);
    const baseName = name.slice(0, name.length - extension.length);

    for (let counter = 1; ; counter++) {
      const candidate = `${baseName} (${counter})${extension}`;

      if (!await isTaken(candidate))
        return candidate;
    }
  }
}
