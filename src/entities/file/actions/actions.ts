"use server"

import {createServerAction} from "@/shared/utilities/create-server-action";
import {requirePermission} from "@/auth";
import {FileManagerService} from "../services/file-manager-service";
import {IFileEntry, IFolder} from "../types/type";

export const getFolderAction = createServerAction<IFolder>(async (folderSlug: string | null) => {
  await requirePermission();

  const [breadcrumbs, entries] = await Promise.all([
    FileManagerService.getBreadcrumbs(folderSlug),
    FileManagerService.getFolderContent(folderSlug)
  ]);

  return {breadcrumbs, entries};
});

export const getFileEntryAction = createServerAction<IFileEntry | null>(async (slug: string) => {
  await requirePermission();
  return FileManagerService.getEntry(slug);
});

export const createDirectoryAction = createServerAction<void>(async (parentSlug: string | null, folderName: string) => {
  await requirePermission("edit-files");
  return FileManagerService.createDirectory(parentSlug, folderName);
}, {revalidatePublicPages: true});

export const renameFileEntryAction = createServerAction<void>(async (slug: string, newName: string) => {
  await requirePermission("edit-files");
  return FileManagerService.rename(slug, newName);
}, {revalidatePublicPages: true});

export const deleteFileEntriesAction = createServerAction<void>(async (slugs: string[]) => {
  await requirePermission("edit-files");
  return FileManagerService.delete(slugs);
}, {revalidatePublicPages: true});

export const moveOrCopyFileEntriesAction = createServerAction<void>(async (targetSlug: string | null, slugs: string[], cut: boolean) => {
  await requirePermission("edit-files");
  return FileManagerService.moveOrCopy(targetSlug, slugs, cut);
}, {revalidatePublicPages: true});
