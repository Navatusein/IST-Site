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

export async function createDirectory(currentPath: string, folderName: string): Promise<void> {
  console.log(folderName);

  return FileManagerService.createDirectory(currentPath, folderName);
}