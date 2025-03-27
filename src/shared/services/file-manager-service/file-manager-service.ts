import * as fs from "node:fs";
import path from "node:path/posix";
import {IDirectory, IFile, IFileTypes} from "@/shared/services/file-manager-service/types/type";

export class FileManagerService {
  private static baseDirectory = path.resolve("public/files");

  public static getFiles(currentPath: string): (IFile | IDirectory)[] {
    if (!fs.existsSync(this.baseDirectory))
      fs.mkdirSync(this.baseDirectory, { recursive: true });

    const resolvedPath = this.resolvePath(currentPath);

    const entries = fs.readdirSync(resolvedPath, {withFileTypes: true});

    return entries.map((entry) => {
      const relativePath = path.join(currentPath, entry.name);
      const fullPath = path.resolve(this.baseDirectory, "." + relativePath);
      const stats = fs.statSync(fullPath);

      if (entry.isDirectory()) {
        return {
          name: entry.name,
          path: relativePath,
          type: "directory",
          size: stats.size,
          pathTo: relativePath
        };
      }
      else {
        return {
          name: entry.name,
          path: relativePath,
          type: this.detectFileType(entry.name),
          size: stats.size
        };
      }
    });
  }

  public static async uploadFileAsync(currentPath: string, file: File): Promise<void> {
    const resolvedPath = this.resolvePath(currentPath);

    const targetPath = path.join(resolvedPath, file.name);

    if (fs.existsSync(targetPath)) {
      throw new Error(`File "${file.name}" already exists in ${currentPath}.`);
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    fs.writeFileSync(targetPath, buffer);
  }

  public static deleteFiles(paths: string[]): void {
    paths.forEach((relativePath) => {
      const resolvedPath = this.resolvePath(relativePath);

      if (!fs.existsSync(resolvedPath)) {
        console.warn(`Path "${relativePath}" does not exist, skipping.`);
        return;
      }

      const stats = fs.statSync(resolvedPath);

      if (stats.isDirectory()) {
        fs.rmSync(resolvedPath, { recursive: true, force: true });
      }
      else {
        fs.unlinkSync(resolvedPath);
      }
    });
  }

  public static createDirectory(currentPath: string, folderName: string): void {
    const resolvedPath = this.resolvePath(path.join(currentPath, folderName));

    if (fs.existsSync(resolvedPath)) {
      throw new Error(`Directory "${folderName}" already exists in "${currentPath}"`);
    }

    fs.mkdirSync(resolvedPath, { recursive: true });
  }

  public static moveOrCopyFiles(targetDirectoryPath: string, files: string[], cut: boolean): void {
    const resolvedTarget = this.resolvePath(targetDirectoryPath);

    if (!fs.existsSync(resolvedTarget)) {
      throw new Error(`Target directory "${targetDirectoryPath}" does not exist.`);
    }

    files.forEach((fileRelativePath) => {
      const resolvedItemPath = this.resolvePath(fileRelativePath);

      if (!fs.existsSync(resolvedItemPath)) {
        console.warn(`Skipping non-existent path: ${fileRelativePath}`);
        return;
      }

      const baseName = path.basename(resolvedItemPath);
      let destinationPath = path.join(resolvedTarget, baseName);
      destinationPath = this.getAvailablePath(destinationPath);
      const stats = fs.statSync(resolvedItemPath);

      if (stats.isDirectory()) {
        this.copyDirectory(resolvedItemPath, destinationPath);
        if (cut)
          fs.rmSync(resolvedItemPath, { recursive: true, force: true });
      }
      else {
        fs.copyFileSync(resolvedItemPath, destinationPath);
        if (cut)
          fs.unlinkSync(resolvedItemPath);
      }
    });
  }

  private static getAvailablePath(targetPath: string): string {
    if (!fs.existsSync(targetPath)) return targetPath;

    const dir = path.dirname(targetPath);
    const ext = path.extname(targetPath);
    const baseName = path.basename(targetPath, ext);

    let counter = 1;
    let newPath;

    do {
      newPath = path.join(dir, `${baseName} (${counter})${ext}`);
      counter++;
    } while (fs.existsSync(newPath));

    return newPath;
  }

  private static copyDirectory(src: string, dest: string): void {
    fs.mkdirSync(dest, { recursive: true });
    const entries = fs.readdirSync(src, { withFileTypes: true });

    for (const entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);

      if (entry.isDirectory()) {
        this.copyDirectory(srcPath, destPath);
      } else {
        fs.copyFileSync(srcPath, destPath);
      }
    }
  }

  private static resolvePath(currentPath: string): string {
    const resolvedPath = path.resolve(this.baseDirectory, "." + currentPath);

    if (!resolvedPath.startsWith(this.baseDirectory)) {
      throw new Error("Access outside /public/files is not allowed.");
    }

    return resolvedPath;
  }

  private static detectFileType(fileName: string): IFileTypes {
    const extension = path.extname(fileName).toLowerCase();

    if ([".jpg", ".jpeg", ".png", ".gif", ".bmp", ".svg", ".webp"].includes(extension)) {
      return "image";
    }

    if ([".pdf"].includes(extension)) {
      return "pdf";
    }

    if ([".txt", ".md", ".log"].includes(extension)) {
      return "text";
    }

    if ([".zip", ".rar", ".7z", ".tar", ".gz"].includes(extension)) {
      return "archive";
    }

    if ([".mp4", ".mov", ".avi", ".mkv", ".webm"].includes(extension)) {
      return "video";
    }

    return "file";
  }
}
