import {ReactNode} from "react";
import {
  ApartmentOutlined,
  DeleteOutlined,
  FileTextOutlined,
  FolderOpenOutlined,
  HistoryOutlined,
  ProfileOutlined,
  ReadOutlined,
  SettingOutlined,
  SolutionOutlined,
  TeamOutlined,
  UserOutlined
} from "@ant-design/icons";
import type {UserPermissionType} from "./permissions-config";

export interface IAdminMenuItem {
  href: string;
  permission: UserPermissionType | UserPermissionType[];
  icon: ReactNode;
  label: string;
  description: string;
}

export interface IAdminMenuSection {
  title: string;
  items: IAdminMenuItem[];
}

const HISTORY_PERMISSIONS: UserPermissionType[] = [
  "edit-dynamic-pages", "edit-news", "edit-department-staff", "edit-department-aspirants", "edit-public-menu"
];

export const ADMIN_MENU_SECTIONS: IAdminMenuSection[] = [
  {
    title: "Контент",
    items: [
      {href: "/admin/dynamic-pages", permission: "edit-dynamic-pages", icon: <FileTextOutlined/>, label: "Динамічні сторінки", description: "Сторінки сайту та їхній вміст"},
      {href: "/admin/news", permission: "edit-news", icon: <ReadOutlined/>, label: "Новини", description: "Новини та оголошення кафедри"},
      {href: "/admin/public-menu", permission: "edit-public-menu", icon: <ProfileOutlined/>, label: "Навігаційне меню", description: "Пункти меню в шапці сайту"},
      {href: "/admin/file-manager", permission: "edit-files", icon: <FolderOpenOutlined/>, label: "Файловий менеджер", description: "Зображення та документи"},
    ]
  },
  {
    title: "Кафедра",
    items: [
      {href: "/admin/department-staff", permission: "edit-department-staff", icon: <TeamOutlined/>, label: "Співробітники кафедри", description: "Викладачі та їхні сторінки"},
      {href: "/admin/department-aspirants", permission: "edit-department-aspirants", icon: <SolutionOutlined/>, label: "Аспіранти кафедри", description: "Аспіранти та їхні керівники"},
    ]
  },
  {
    title: "Огляд",
    items: [
      {href: "/admin/site-map", permission: "edit-dynamic-pages", icon: <ApartmentOutlined/>, label: "Карта сайту", description: "Зв'язки та биті посилання"},
      {href: "/admin/changes", permission: HISTORY_PERMISSIONS, icon: <HistoryOutlined/>, label: "Журнал змін", description: "Хто, коли й що змінив"},
      {href: "/admin/trash", permission: HISTORY_PERMISSIONS, icon: <DeleteOutlined/>, label: "Кошик", description: "Відновлення видалених записів"},
    ]
  },
  {
    title: "Адміністрування",
    items: [
      {href: "/admin/users", permission: "edit-users", icon: <UserOutlined/>, label: "Користувачі", description: "Облікові записи та права"},
      {href: "/admin/site-settings", permission: "edit-site-settings", icon: <SettingOutlined/>, label: "Налаштування сайту", description: "Назва, контакти, підвал"},
    ]
  },
];

export function getAllowedAdminMenuSections(userPermissions: UserPermissionType[]): IAdminMenuSection[] {
  return ADMIN_MENU_SECTIONS
    .map((section) => ({
      ...section,
      items: section.items.filter((item) => [item.permission].flat().some((permission) => userPermissions.includes(permission)))
    }))
    .filter((section) => section.items.length != 0);
}
