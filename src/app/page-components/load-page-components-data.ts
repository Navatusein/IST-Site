import {IBasePageComponent, IPageComponentGroup, IPageEntity} from "@/entities/dynamic-page";
import type {PageComponentsData} from "@/entities/dynamic-page/model";
import {IServerActionResult} from "@/shared/types/server-action-result";
import {getDepartmentStaffAction} from "@/entities/department-staff/actions/actions";
import {getNewsListDataAction} from "@/page-components/news-list/actions/actions";
import {getDepartmentAspirantListDataAction} from "@/page-components/department-aspirants-list/actions/actions";
import type {INewsListPageComponent} from "@/page-components/news-list/types/type";
import {getPageLinkFilesAction} from "@/features/page-link/actions/actions";
import {getFileSlugs} from "@/page-components/buttons/utilities/get-file-slugs";
import type {IButtonsPageComponent} from "@/page-components/buttons/types/type";
import {getFileSlugs as getLinkCardsFileSlugs} from "@/page-components/link-cards/utilities/get-file-slugs";
import type {ILinkCardsPageComponent} from "@/page-components/link-cards/types/type";
import type {IDocumentPageComponent} from "@/page-components/document/types/type";
import {getSiteSettingsAction} from "@/entities/site-settings/actions/actions";

type PageComponentDataLoader = (component: IBasePageComponent) => Promise<IServerActionResult<unknown>>;

const pageComponentDataLoaders: Record<string, PageComponentDataLoader> = {
  "news-list": (component) => getNewsListDataAction((component as INewsListPageComponent).countDisplayed, 1),
  "department-staff-list": () => getDepartmentStaffAction(),
  "department-aspirant-list": () => getDepartmentAspirantListDataAction(),
  "buttons": (component) => getPageLinkFilesAction(getFileSlugs(component as IButtonsPageComponent)),
  "link-cards": (component) => getPageLinkFilesAction(getLinkCardsFileSlugs(component as ILinkCardsPageComponent)),
  "contact-us": () => getSiteSettingsAction(),
  "document": (component) => {
    const slug = (component as IDocumentPageComponent).fileSlug;
    return getPageLinkFilesAction(slug ? [slug] : []);
  },
};

export async function loadPageComponentsData(entities: IPageEntity[]): Promise<PageComponentsData> {
  const components = entities.flatMap((entity) => {
    if (entity.type == "group")
      return (entity as IPageComponentGroup).components;

    return [entity as IBasePageComponent];
  });

  const results = await Promise.all(components.map(async (component) => {
    const loader = pageComponentDataLoaders[component.componentType];

    if (!loader)
      return null;

    const result = await loader(component);

    return result.success ? [component.id, result.data] as const : null;
  }));

  return Object.fromEntries(results.filter((x) => x != null));
}
