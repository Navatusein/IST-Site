import {IBasePageComponent} from "@/entities/dynamic-page";

export interface IGalleryCarouselPageComponent extends IBasePageComponent {
  imagePaths: string[],
}

export const GalleryCarouselComponentExample = {
  name: "Галерея",
  component: {
    type: "gallery-carousel",
    allowedWidth: "large",
    width: "large",
    imagePaths: [] as string[]
  } as IGalleryCarouselPageComponent
}