import {RevisionCollection} from "@/shared/types/revision";
import type {UserPermissionType} from "@/entities/user/types/type";

interface IRevisionTable {
  name: string;
  permission: UserPermissionType;
  url: string;
  fieldLabels: Record<string, string>;
}

export const REVISION_TABLES: Record<RevisionCollection, IRevisionTable> = {
  "dynamic-pages": {
    name: "Динамічні сторінки",
    permission: "edit-dynamic-pages",
    url: "/admin/dynamic-pages",
    fieldLabels: {name: "Назва", title: "Заголовок", description: "Опис", path: "Шлях", entities: "Блоки"}
  },
  "news": {
    name: "Новини",
    permission: "edit-news",
    url: "/admin/news",
    fieldLabels: {title: "Заголовок", description: "Опис", date: "Дата", imageSlug: "Зображення", path: "Шлях", entities: "Блоки"}
  },
  "department-staff": {
    name: "Співробітники",
    permission: "edit-department-staff",
    url: "/admin/department-staff",
    fieldLabels: {
      lastName: "Прізвище", firstName: "Ім'я", middleName: "По батькові", position: "Посада", email: "Email",
      imageSlug: "Фото", path: "Шлях", profiles: "Профілі", entities: "Блоки"
    }
  },
  "department-aspirants": {
    name: "Аспіранти",
    permission: "edit-department-aspirants",
    url: "/admin/department-aspirants",
    fieldLabels: {
      lastName: "Прізвище", firstName: "Ім'я", middleName: "По батькові", thesisTheme: "Тема дисертації",
      thesisDate: "Дата захисту", thesisHeadId: "Науковий керівник", imageSlug: "Фото"
    }
  },
  "public-menu": {
    name: "Меню",
    permission: "edit-public-menu",
    url: "/admin/public-menu",
    fieldLabels: {label: "Назва", path: "Шлях", parent: "Батьківський пункт", index: "Індекс"}
  },
};
