import * as fs from "node:fs";
import path from "node:path";
import mongoose from "mongoose";
import mime from "mime";
import {FileManagerService, generateFileSlug} from "@/entities/file/services/file-manager-service";

export async function migrateFilesToSlugs(db: mongoose.mongo.Db): Promise<void> {
  const storageDirectory = FileManagerService.storageDirectory;

  fs.mkdirSync(storageDirectory, {recursive: true});

  const slugsByLegacyPath = await indexStorage(db, storageDirectory);
  removeEmptyDirectories(storageDirectory);

  const replacer = createReplacer(slugsByLegacyPath);

  for (const collectionName of ["news", "department-staff", "department-aspirants", "dynamic-pages"]) {
    const collection = db.collection(collectionName);

    for await (const document of collection.find({})) {
      const update: Record<string, unknown> = {};
      const unset: Record<string, ""> = {};

      if ("imagePath" in document) {
        const slug = replacer.mapPath(document.imagePath);

        if (slug)
          update.imageSlug = slug;

        unset.imagePath = "";
      }

      if (Array.isArray(document.entities))
        update.entities = document.entities.map((entity: unknown) => migrateEntity(entity, replacer));

      if (Object.keys(update).length == 0 && Object.keys(unset).length == 0)
        continue;

      await collection.updateOne({_id: document._id}, {
        ...(Object.keys(update).length != 0 ? {$set: update} : {}),
        ...(Object.keys(unset).length != 0 ? {$unset: unset} : {}),
      });
    }
  }
}

async function indexStorage(db: mongoose.mongo.Db, storageDirectory: string): Promise<Map<string, string>> {
  const files = db.collection("files");
  const slugsByLegacyPath = new Map<string, string>();

  const walk = async (directory: string, legacyDirectory: string, parentSlug: string | null) => {
    const entries = fs.readdirSync(directory, {withFileTypes: true});

    for (const entry of entries) {
      const absolutePath = path.join(directory, entry.name);
      const legacyPath = path.posix.join(legacyDirectory, entry.name);

      if (entry.isDirectory()) {
        let folder = await files.findOne({legacyPath, kind: "directory"});

        if (!folder) {
          const slug = generateFileSlug();
          await files.insertOne(newDocument({slug, name: entry.name, kind: "directory", parentSlug, legacyPath}));
          folder = {slug} as never;
        }

        await walk(absolutePath, legacyPath, folder!.slug);
        continue;
      }

      if (!entry.isFile())
        continue;

      if (parentSlug == null && await files.findOne({storageName: entry.name}))
        continue;

      const existing = await files.findOne({legacyPath, kind: "file"});
      const slug = existing?.slug ?? generateFileSlug();
      const storageName = existing?.storageName ?? slug + path.extname(entry.name).toLowerCase();

      if (!existing) {
        await files.insertOne(newDocument({
          slug,
          name: entry.name,
          kind: "file",
          parentSlug,
          storageName,
          mimeType: mime.getType(entry.name) ?? "application/octet-stream",
          size: fs.statSync(absolutePath).size,
          legacyPath
        }));
      }

      fs.renameSync(absolutePath, path.join(storageDirectory, storageName));
    }
  };

  await walk(storageDirectory, "/", null);

  for await (const file of files.find({kind: "file", legacyPath: {$exists: true}}))
    slugsByLegacyPath.set(file.legacyPath, file.slug);

  return slugsByLegacyPath;
}

function newDocument(fields: Record<string, unknown>) {
  const now = new Date();
  return {...fields, createdAt: now, updatedAt: now};
}

function removeEmptyDirectories(storageDirectory: string): void {
  const hasFiles = (directory: string): boolean => fs.readdirSync(directory, {withFileTypes: true}).some((entry) => (
    entry.isDirectory() ? hasFiles(path.join(directory, entry.name)) : true
  ));

  for (const entry of fs.readdirSync(storageDirectory, {withFileTypes: true})) {
    const directory = path.join(storageDirectory, entry.name);

    if (entry.isDirectory() && !hasFiles(directory))
      fs.rmSync(directory, {recursive: true, force: true});
  }
}

interface IReplacer {
  mapPath: (value: unknown) => string | undefined;
  replaceLinks: (value: string) => string;
}

function createReplacer(slugsByLegacyPath: Map<string, string>): IReplacer {
  const normalize = (value: string) => {
    let result = value.trim();

    try {
      result = decodeURI(result);
    }
    catch {
    }

    return result.startsWith("/") ? result : "/" + result;
  };

  const legacyPaths = [...slugsByLegacyPath.keys()].sort((a, b) => b.length - a.length);
  const escape = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  const linkPatterns = legacyPaths.flatMap((legacyPath) => {
    const slug = slugsByLegacyPath.get(legacyPath)!;
    const variants = [...new Set([legacyPath, encodeURI(legacyPath)])].map(escape).join("|");

    return [
      {pattern: new RegExp(`/file(?:${variants})(?=["'\\\\\\s?#)<]|$)`, "g"), replacement: `/file/${slug}`},
      {pattern: new RegExp(`/api/assets/?(?:${variants})(?=["'\\\\\\s?#)<]|$)`, "g"), replacement: `/api/assets/${slug}`},
    ];
  });

  return {
    mapPath: (value) => typeof value == "string" && value ? slugsByLegacyPath.get(normalize(value)) : undefined,
    replaceLinks: (value) => linkPatterns.reduce((result, {pattern, replacement}) => result.replace(pattern, replacement), value),
  };
}

function migrateEntity(entity: any, replacer: IReplacer): unknown {
  if (entity == null || typeof entity != "object")
    return entity;

  const result: any = Object.fromEntries(Object.entries(entity).map(([key, value]) => [key, replaceStrings(value, replacer)]));

  if (Array.isArray(result.components))
    result.components = result.components.map((component: unknown) => migrateEntity(component, replacer));

  if ("imagePath" in result) {
    result.imageSlug = replacer.mapPath(entity.imagePath);
    delete result.imagePath;
  }

  if ("imagePaths" in result) {
    result.imageSlugs = (Array.isArray(entity.imagePaths) ? entity.imagePaths : [])
      .map((imagePath: unknown) => replacer.mapPath(imagePath))
      .filter((slug: string | undefined) => slug != null);
    delete result.imagePaths;
  }

  if (result.componentType == "link-button" && result.linkType == "file")
    result.link = replacer.mapPath(entity.link) ?? result.link;

  return result;
}

function replaceStrings(value: unknown, replacer: IReplacer): unknown {
  if (typeof value == "string")
    return replacer.replaceLinks(value);

  if (Array.isArray(value))
    return value.map((item) => replaceStrings(item, replacer));

  if (value != null && typeof value == "object" && value.constructor == Object)
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, replaceStrings(item, replacer)]));

  return value;
}
