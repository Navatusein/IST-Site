import {IBasePageComponent} from "@/entities/dynamic-page";

export interface IGalleryCarouselPageComponent extends IBasePageComponent {
  imagePaths: string[],
  allowedWidth: ["large"],
}

export const GalleryCarouselComponentExample = {
  name: "Галерея",
  component: {
    type: "component",
    componentType: "gallery-carousel",
    allowedWidth: ["large"],
    width: "large",
    imagePaths: [] as string[]
  } as IGalleryCarouselPageComponent
}