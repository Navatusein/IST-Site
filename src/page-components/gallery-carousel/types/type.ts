import {IBasePageComponent} from "@/entities/dynamic-page";

export interface IGalleryCarouselPageComponent extends IBasePageComponent {
  componentType: "gallery-carousel";
  imageSlugs: string[];
}
