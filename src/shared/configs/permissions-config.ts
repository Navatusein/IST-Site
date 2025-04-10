import {PermissionType} from "@/shared/types/permissions";

export const permissions: PermissionType = {
  "edit-files": {
    name: "Edit Files",
    paths: [
      "/admin/file-manager"
    ],
  },
  "edit-news": {
    name: "Edit News",
    paths: [
      "/admin/edit-news"
    ],
  },
  "edit-pages": {
    name: "Edit Pages",
    paths: [
      "/admin/edit-pages",
      "/admin/edit/page/[...path]"
    ],
  },
  "edit-users": {
    name: "Edit Users",
    paths: [
      "/admin/edit-users"
    ],
  }
};