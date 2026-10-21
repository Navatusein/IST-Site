"use server"

import {DynamicPageModel} from "@/entities/dynamic-page";
import {NewsModel} from "@/entities/news";
import {DepartmentStaff} from "@/entities/department-staff";
import {PublicMenuItemModal} from "@/entities/public-menu-item";
import {createServerAction} from "@/shared/utilities/create-server-action";
import {requirePermission} from "@/auth";
import {IBrokenPageLink, ISiteLinksGraph} from "../types/type";
import {extractEntityLinks, normalizeSitePath} from "../utilities/extract-links";
import {getEntitiesCodeLinks, ICodeLinksContext} from "../utilities/code-links";
import {buildSiteLinksGraph, ISiteLinkSource} from "../utilities/site-links-graph";

interface IEntitiesDocument {
  _id: unknown;
  path: string;
  entities?: unknown;
}

export const getSiteLinksAction = createServerAction<ISiteLinksGraph>(async () => {
  await requirePermission("edit-dynamic-pages");

  const [pages, news, staff, menu] = await Promise.all([
    DynamicPageModel.find({}, {name: 1, path: 1, entities: 1}).lean<(IEntitiesDocument & {name: string})[]>(),
    NewsModel.find({}, {title: 1, path: 1, entities: 1}).lean<(IEntitiesDocument & {title: string})[]>(),
    DepartmentStaff.find({}, {firstName: 1, lastName: 1, path: 1, entities: 1}).lean<(IEntitiesDocument & {firstName: string, lastName: string})[]>(),
    PublicMenuItemModal.find({}, {label: 1, path: 1}).lean<{_id: unknown, label: string, path?: string}[]>(),
  ]);

  const context: ICodeLinksContext = {staffPaths: staff.map((person) => `/department-staff/${person.path}`)};
  const getLinks = (entities: unknown) => [...extractEntityLinks(entities), ...getEntitiesCodeLinks(entities, context)];

  const sources: ISiteLinkSource[] = [
    ...pages.map((page) => ({
      node: {key: `/${page.path}`, kind: "page" as const, title: page.name, path: `/${page.path}`, editUrl: `/admin/edit-page/dynamic-page/${page.path}`},
      links: getLinks(page.entities)
    })),
    ...news.map((item) => ({
      node: {key: `/news/${item.path}`, kind: "news" as const, title: item.title, path: `/news/${item.path}`, editUrl: `/admin/edit-page/news/${item.path}`},
      links: getLinks(item.entities)
    })),
    ...staff.map((person) => ({
      node: {
        key: `/department-staff/${person.path}`,
        kind: "staff" as const,
        title: `${person.lastName} ${person.firstName}`.trim(),
        path: `/department-staff/${person.path}`,
        editUrl: `/admin/edit-page/department-staff/${person.path}`
      },
      links: getLinks(person.entities)
    })),
    ...menu.map((item) => ({
      node: {key: `menu:${String(item._id)}`, kind: "menu" as const, title: item.label, editUrl: `/admin/public-menu?edit=${String(item._id)}`},
      links: item.path ? [{href: item.path}] : []
    })),
  ];

  return buildSiteLinksGraph(sources, process.env.APP_PUBLIC_URL);
});

const MAX_CHECKED_PATHS = 500;

async function findMissingPaths(paths: string[]): Promise<Set<string>> {
  const newsPaths = paths.filter((path) => /^\/news\/[^/]+$/.test(path)).map((path) => path.slice("/news/".length));
  const staffPaths = paths.filter((path) => /^\/department-staff\/[^/]+$/.test(path)).map((path) => path.slice("/department-staff/".length));
  const pagePaths = paths.filter((path) => !path.startsWith("/news/") && !path.startsWith("/department-staff/")).map((path) => path.slice(1));

  const [pages, news, staff] = await Promise.all([
    pagePaths.length ? DynamicPageModel.find({path: {$in: pagePaths}}, {path: 1}).lean<{path: string}[]>() : [],
    newsPaths.length ? NewsModel.find({path: {$in: newsPaths}}, {path: 1}).lean<{path: string}[]>() : [],
    staffPaths.length ? DepartmentStaff.find({path: {$in: staffPaths}}, {path: 1}).lean<{path: string}[]>() : [],
  ]);

  const existing = new Set([
    ...pages.map((page) => `/${page.path}`),
    ...news.map((item) => `/news/${item.path}`),
    ...staff.map((person) => `/department-staff/${person.path}`),
  ]);

  return new Set(paths.filter((path) => !existing.has(path)));
}

export const findBrokenPageLinksAction = createServerAction<IBrokenPageLink[]>(async (entities: unknown) => {
  await requirePermission();

  const links = [...extractEntityLinks(entities), ...getEntitiesCodeLinks(entities, {staffPaths: []})]
    .map((link) => ({...link, path: normalizeSitePath(link.href, process.env.APP_PUBLIC_URL)}))
    .filter((link): link is IBrokenPageLink => link.path != null);

  const paths = [...new Set(links.map((link) => link.path))].slice(0, MAX_CHECKED_PATHS);

  if (paths.length == 0)
    return [];

  const missing = await findMissingPaths(paths);

  return links
    .filter((link) => missing.has(link.path))
    .map(({href, path, componentId}) => ({href, path, componentId}));
});
