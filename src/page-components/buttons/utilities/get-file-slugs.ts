import {getPageLinkFileSlugs} from "@/features/page-link/utilities/page-link";
import {IButtonsPageComponent} from "../types/type";

export function getFileSlugs(component: IButtonsPageComponent): string[] {
  return getPageLinkFileSlugs(component.buttons ?? []);
}
