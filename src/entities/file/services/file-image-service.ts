import * as fs from "node:fs";
import * as fsp from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import {randomBytes} from "node:crypto";
import sharp from "sharp";
import type {ImageWidth} from "@/shared/configs/image-widths";
import type {IServableFile} from "./file-manager-service";

// Not in public/files, which Next serves statically
const CACHE_DIRECTORY = path.join(os.tmpdir(), "ist-site-images");

const RESIZABLE_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);

export interface IResizedImage {
  path: string;
  size: number;
  mimeType: string;
}

export class FileImageService {
  public static isResizable(file: IServableFile): boolean {
    return RESIZABLE_TYPES.has(file.mimeType.toLowerCase());
  }

  // null when the copy is not smaller than the original (already small and compressed)
  public static async getResized(file: IServableFile, width: ImageWidth): Promise<IResizedImage | null> {
    const {mtimeMs} = await fsp.stat(file.storagePath);
    const cachePath = path.join(CACHE_DIRECTORY, `${path.basename(file.storagePath)}-${Math.floor(mtimeMs)}-${width}.webp`);

    if (!fs.existsSync(cachePath)) {
      await fsp.mkdir(CACHE_DIRECTORY, {recursive: true});

      // Parallel requests for the same copy must not read a half-written file
      const temporaryPath = `${cachePath}.${randomBytes(4).toString("hex")}.tmp`;

      await sharp(file.storagePath)
        .rotate()
        .resize({width, withoutEnlargement: true})
        .webp({quality: 80})
        .toFile(temporaryPath);

      await fsp.rename(temporaryPath, cachePath);
    }

    const {size} = await fsp.stat(cachePath);

    return size < file.size ? {path: cachePath, size, mimeType: "image/webp"} : null;
  }
}
