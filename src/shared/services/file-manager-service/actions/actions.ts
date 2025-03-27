"use server"

import {IDirectory, IFile} from "@/shared/services/file-manager-service/types/type";
import {FileManagerService} from "@/shared/services/file-manager-service/file-manager-service";

export async function getFilesAction(currentPath: string): Promise<(IFile | IDirectory)[]> {
  return FileManagerService.getFiles(currentPath);
}

export async function uploadFilesAction(currentPath: string, file: File): Promise<void> {
  return FileManagerService.uploadFileAsync(currentPath, file);
}

export async function deleteFilesAction(paths: string[]): Promise<void> {
  return FileManagerService.deleteFiles(paths);
}

export async function createDirectoryAction(currentPath: string, folderName: string): Promise<void> {
  return FileManagerService.createDirectory(currentPath, folderName);
}

export async function moveOrCopyFilesAction(targetDirectoryPath: string, files: string[], cut: boolean): Promise<void> {
  return FileManagerService.moveOrCopyFiles(targetDirectoryPath, files, cut);
}

export async function renameAction(relativePath: string, newName: string): Promise<void> {
  return FileManagerService.rename(relativePath, newName);
}