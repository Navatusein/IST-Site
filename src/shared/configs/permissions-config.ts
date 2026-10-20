import {PermissionType} from "@/shared/types/permissions";

export const defaultPermissions = [
  "edit-news",
  "edit-dynamic-pages",
  "edit-public-menu",
  "edit-users",
  "edit-files",
  "edit-department-staff",
  "edit-department-aspirants",
  "edit-site-settings"
]

export const permissions: PermissionType = {
  "edit-news": {
    name: "Edit News",
    paths: [
      "/admin/news",
      "/admin/news/[path]",
      "/admin/edit-page/news/[path]"
    ],
  },
  "edit-dynamic-pages": {
    name: "Edit Dynamic Pages",
    paths: [
      "/admin/dynamic-pages",
      "/admin/dynamic-pages/[...path]",
      "/admin/edit-page/dynamic-page/[...path]"
    ],
  },
  "edit-public-menu": {
    name: "Edit Public Pages",
    paths: [
      "/admin/public-menu"
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
      "/admin/department-staff/[path]",
      "/admin/edit-page/department-staff/[path]"
    ],
  },
  "edit-department-aspirants": {
    name: "Edit Department Aspirants",
    paths: [
      "/admin/department-aspirants",
    ],
  },
  "edit-site-settings": {
    name: "Edit Site Settings",
    paths: [
      "/admin/site-settings"
    ],
  },
};