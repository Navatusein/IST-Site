import {PermissionType} from "@/shared/types/permissions";

export const permissions: PermissionType = {
  "edit-news": {
    name: "Edit News",
    paths: [
      "/admin/news",
      "/admin/edit-page/news/[path]"
    ],
  },
  "edit-dynamic-pages": {
    name: "Edit Dynamic Pages",
    paths: [
      "/admin/dynamic-pages",
      "/admin/edit-page/dynamic-pages/[...path]"
    ],
  },
  "edit-public-menu": {
    name: "Edit Public Pages",
    paths: [
      "/admin/public-manu"
    ],
  },
  "edit-users": {
    name: "Edit Users",
    paths: [
      "/admin/users"
    ],
  },
  "edit-files": {
    name: "Edit Files",
    paths: [
      "/admin/file-manager"
    ],
  },
  "edit-department-staff": {
    name: "Edit Department Staff",
    paths: [
      "/admin/department-staff",
      "/admin/edit-page/department-staff/[path]"
    ],
  },
};