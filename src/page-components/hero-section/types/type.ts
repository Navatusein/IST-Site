import {IBasePageComponent} from "@/entities/dynamic-page";

export interface IHeroSectionPageComponent extends IBasePageComponent {
  componentType: "hero-section";
  title: string;
  imageSlug?: string;
  imageHeight: number;
}
