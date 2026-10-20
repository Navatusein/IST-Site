import * as fs from "node:fs";
import * as fsp from "node:fs/promises";
import path from "node:path";
import {randomBytes} from "node:crypto";
import mime from "mime";
import {ServerActionError} from "@/shared/exceptions/server-action-error";
import FileEntryModel from "../types/schema";
import {IFileEntry, IFileEntryDocument, IFileTypes, IFolderBreadcrumb} from "../types/type";

const STORAGE_DIRECTORY = path.resolve("public/files");
const SLUG_ALPHABET = "abcdefghijklmnopqrstuvwxyz0123456789";
const SLUG_LENGTH = 10;

export interface IServableFile {
  storagePath: string;
  name: string;
  mimeType: string;
  size: number;
}

export function generateFileSlug(): string {
  return Array.from(randomBytes(SLUG_LENGTH), (byte) => SLUG_ALPHABET[byte % SLUG_ALPHABET.length]).join("");
}

export function detectFileType(fileName: string): IFileTypes {
  const extension = path.extname(fileName).toLowerCase();

  if ([".jpg", ".jpeg", ".png", ".gif", ".bmp", ".svg", ".webp", ".avif"].includes(extension))
    return "image";

  if ([".pdf"].includes(extension))
    return "pdf";

  if ([".txt", ".md", ".log", ".doc", ".docx"].includes(extension))
    return "text";

  if ([".zip", ".rar", ".7z", ".tar", ".gz"].includes(extension))
    return "archive";

  if ([".mp4", ".mov", ".avi", ".mkv", ".webm"].includes(extension))
    return "video";

  return "file";
}

export class FileManagerService {
  public static readonly storageDirectory = STORAGE_DIRECTORY;

  public static getStoragePath(storageName: string): string {
    return path.join(STORAGE_DIRECTORY, path.basename(storageName));
  }

  public static async getFolderContent(folderSlug: string | null): Promise<IFileEntry[]> {
    await this.ensureFolder(folderSlug);

    const documents = await FileEntryModel
      .find({parentSlug: folderSlug})
      .collation({locale: "uk"})
      .sort({kind: 1, name: 1})
      .lean<IFileEntryDocument[]>();

    return documents.map((document) => this.toEntry(document));
  }

  public static async getBreadcrumbs(folderSlug: string | null): Promise<IFolderBreadcrumb[]> {
    const breadcrumbs: IFolderBreadcrumb[] = [];
    let currentSlug = folderSlug;

    while (currentSlug != null) {
      const folder = await this.ensureFolder(currentSlug);
      breadcrumbs.unshift({slug: folder!.slug, name: folder!.name});
      currentSlug = folder!.parentSlug;
    }

    return [{slug: null, name: "Файли"}, ...breadcrumbs];
  }

  public static async getEntry(slug: string): Promise<IFileEntry | null> {
    const document = await FileEntryModel.findOne({slug}).lean<IFileEntryDocument>();
    return document ? this.toEntry(document) : null;
  }

  public static async getEntries(slugs: string[]): Promise<IFileEntry[]> {
    if (slugs.length == 0)
      return [];

    const documents = await FileEntryModel.find({slug: {$in: slugs}}).lean<IFileEntryDocument[]>();
    return documents.map((document) => this.toEntry(document));
  }

  public static async upload(parentSlug: string | null, file: File): Promise<IFileEntry> {
    await this.ensureFolder(parentSlug);

    const name = this.validateName(file.name);

    if (await FileEntryModel.exists({parentSlug, name}))
      throw new ServerActionError(`Файл "${name}" вже існує в цій папці`);

    const slug = generateFileSlug();
    const storageName = slug + path.extname(name).toLowerCase();
    const storagePath = this.getStoragePath(storageName);

    await fsp.mkdir(STORAGE_DIRECTORY, {recursive: true});
    await fsp.writeFile(storagePath, Buffer.from(await file.arrayBuffer()));

    try {
      const document = await FileEntryModel.create({
        slug,
        name,
        kind: "file",
        parentSlug,
        storageName,
        mimeType: mime.getType(name) ?? "application/octet-stream",
        size: file.size
      });

      return this.toEntry(document.toObject());
    }
    catch (error) {
      await fsp.rm(storagePath, {force: true});
      throw error;
    }
  }

  public static async createDirectory(parentSlug: string | null, folderName: string): Promise<void> {
    await this.ensureFolder(parentSlug);

    const name = this.validateName(folderName);

    if (await FileEntryModel.exists({parentSlug, name}))
      throw new ServerActionError(`Папка "${name}" вже існує`);

    await FileEntryModel.create({slug: generateFileSlug(), name, kind: "directory", parentSlug});
  }

  public static async rename(slug: string, newName: string): Promise<void> {
    const entry = await FileEntryModel.findOne({slug}).lean<IFileEntryDocument>();

    if (!entry)
      throw new ServerActionError("Файл не знайдено");

    const name = this.validateName(newName);

    if (name == entry.name)
      return;

    await FileEntryModel.updateOne({slug}, {$set: {name: await this.getAvailableName(entry.parentSlug, name)}});
  }

  public static async delete(slugs: string[]): Promise<void> {
    const entries = await this.collectWithDescendants(slugs);

    await Promise.all(entries
      .filter((entry) => entry.storageName)
      .map((entry) => fsp.rm(this.getStoragePath(entry.storageName!), {force: true}))
    );

    await FileEntryModel.deleteMany({slug: {$in: entries.map((entry) => entry.slug)}});
  }

  public static async moveOrCopy(targetSlug: string | null, slugs: string[], cut: boolean): Promise<void> {
    await this.ensureFolder(targetSlug);

    const targetAncestors = new Set((await this.getBreadcrumbs(targetSlug)).map((x) => x.slug));

    for (const slug of slugs) {
      const entry = await FileEntryModel.findOne({slug}).lean<IFileEntryDocument>();

      if (!entry)
        continue;

      if (entry.kind == "directory" && targetAncestors.has(entry.slug))
        throw new ServerActionError(`Неможливо перемістити папку "${entry.name}" саму в себе`);

      if (cut) {
        if (entry.parentSlug == targetSlug)
          continue;

        const name = await this.getAvailableName(targetSlug, entry.name);
        await FileEntryModel.updateOne({slug}, {$set: {parentSlug: targetSlug, name}});
      }
      else {
        await this.copyEntry(entry, targetSlug, await this.getAvailableName(targetSlug, entry.name));
      }
    }
  }

  public static async findFile(segments: string[]): Promise<IFileEntry | null> {
    const entry = await this.findFileDocument(segments);
    return entry ? this.toEntry(entry) : null;
  }

  private static async findFileDocument(segments: string[]): Promise<IFileEntryDocument | null> {
    let entry: IFileEntryDocument | null = null;

    if (segments.length == 1 || segments.length == 2)
      entry = await FileEntryModel.findOne({slug: segments[0], kind: "file"}).lean<IFileEntryDocument>();

    if (!entry)
      entry = await FileEntryModel.findOne({legacyPath: "/" + segments.join("/"), kind: "file"}).lean<IFileEntryDocument>();

    return entry;
  }

  public static async findServableFile(segments: string[]): Promise<IServableFile | null> {
    const entry = await this.findFileDocument(segments);

    if (!entry?.storageName)
      return null;

    const storagePath = this.getStoragePath(entry.storageName);

    if (!fs.existsSync(storagePath))
      return null;

    return {
      storagePath,
      name: entry.name,
      mimeType: entry.mimeType ?? "application/octet-stream",
      size: (await fsp.stat(storagePath)).size
    };
  }

  private static async copyEntry(entry: IFileEntryDocument, parentSlug: string | null, name: string): Promise<void> {
    const slug = generateFileSlug();

    if (entry.kind == "file") {
      const storageName = slug + path.extname(entry.storageName ?? entry.name).toLowerCase();

      await fsp.copyFile(this.getStoragePath(entry.storageName!), this.getStoragePath(storageName));
      await FileEntryModel.create({
        slug,
        name,
        kind: "file",
        parentSlug,
        storageName,
        mimeType: entry.mimeType,
        size: entry.size
      });

      return;
    }

    await FileEntryModel.create({slug, name, kind: "directory", parentSlug});

    const children = await FileEntryModel.find({parentSlug: entry.slug}).lean<IFileEntryDocument[]>();

    for (const child of children)
      await this.copyEntry(child, slug, child.name);
  }

  private static async collectWithDescendants(slugs: string[]): Promise<IFileEntryDocument[]> {
    const result: IFileEntryDocument[] = [];
    let current = await FileEntryModel.find({slug: {$in: slugs}}).lean<IFileEntryDocument[]>();

    while (current.length != 0) {
      result.push(...current);

      const directorySlugs = current.filter((x) => x.kind == "directory").map((x) => x.slug);

      current = directorySlugs.length != 0
        ? await FileEntryModel.find({parentSlug: {$in: directorySlugs}}).lean<IFileEntryDocument[]>()
        : [];
    }

    return result;
  }

  private static async ensureFolder(folderSlug: string | null): Promise<IFileEntryDocument | null> {
    if (folderSlug == null)
      return null;

    const folder = await FileEntryModel.findOne({slug: folderSlug, kind: "directory"}).lean<IFileEntryDocument>();

    if (!folder)
      throw new ServerActionError("Папку не знайдено");

    return folder;
  }

  private static async getAvailableName(parentSlug: string | null, name: string): Promise<string> {
    if (!await FileEntryModel.exists({parentSlug, name}))
      return name;

    const extension = path.extname(name);
    const baseName = name.slice(0, name.length - extension.length);

    for (let counter = 1; ; counter++) {
      const candidate = `${baseName} (${counter})${extension}`;

      if (!await FileEntryModel.exists({parentSlug, name: candidate}))
        return candidate;
    }
  }

  public static validateName(name: string): string {
    const trimmed = name.trim();

    if (!trimmed || trimmed == "." || trimmed == ".." || /[\\/]/.test(trimmed) || trimmed.length > 255)
      throw new ServerActionError(`Неприпустима назва "${name}"`);

    return trimmed;
  }

  private static toEntry(document: IFileEntryDocument): IFileEntry {
    return {
      slug: document.slug,
      name: document.name,
      kind: document.kind,
      type: document.kind == "directory" ? "directory" : detectFileType(document.name),
      parentSlug: document.parentSlug ?? null,
      size: document.size ?? 0,
      extension: document.kind == "file" ? path.extname(document.name).toLowerCase() : undefined
    };
  }
}
