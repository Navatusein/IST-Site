"use server"

import {IDirectory, IFile} from "@/shared/services/file-manager-service/types/type";
import {FileManagerService} from "@/shared/services/file-manager-service/file-manager-service";
import {createServerAction} from "@/shared/utilities/create-server-action";

export const getFilesAction = createServerAction<(IFile | IDirectory)[]>(async (currentPath: string) => {
  return FileManagerService.getFiles(currentPath);
});

export const uploadFilesAction = createServerAction<void>(async (currentPath: string, file: File) => {
  return FileManagerService.uploadFileAsync(currentPath, file);
});

export const deleteFilesAction = createServerAction<void>(async (paths: string[]) => {
  return FileManagerService.deleteFiles(paths);
});

export const createDirectoryAction = createServerAction<void>(async (currentPath: string, folderName: string) => {
  return FileManagerService.createDirectory(currentPath, folderName);
});

export const moveOrCopyFilesAction = createServerAction<void>(async (targetDirectoryPath: string, files: string[], cut: boolean) => {
  return FileManagerService.moveOrCopyFiles(targetDirectoryPath, files, cut);
});

export const renameAction = createServerAction<void>(async (relativePath: string, newName: string) => {
  return FileManagerService.rename(relativePath, newName);
});

export const isDirectoryAction = createServerAction<boolean>(async (relativePath: string) => {
  return FileManagerService.isDirectory(relativePath);
});