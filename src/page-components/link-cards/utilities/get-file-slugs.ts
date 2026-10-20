import {getPageLinkFileSlugs} from "@/features/page-link/utilities/page-link";
import {ILinkCardsPageComponent} from "../types/type";

export function getFileSlugs(component: ILinkCardsPageComponent): string[] {
  return getPageLinkFileSlugs(component.cards ?? []);
}
