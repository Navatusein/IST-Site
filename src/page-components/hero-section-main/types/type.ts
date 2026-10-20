import {IBasePageComponent} from "@/entities/dynamic-page";

export interface IHeroSectionMainFastLink {
  path: string;
  title: string;
}

export interface IHeroSectionMainStatistics {
  title: string;
  icon?: string;
  value: number;
}

export interface IHeroSectionMainPageComponent extends IBasePageComponent {
  componentType: "hero-section-main";
  department: string;
  faculty: string;
  university: string;
  text: string;
  imageSlug?: string;
  imageHeight: number;
  fastLinks: IHeroSectionMainFastLink[];
  statistics: IHeroSectionMainStatistics[];
}
