import {IBasePageComponent} from "@/entities/dynamic-page";

export type ImageAspectRatio = "original" | "16/9" | "4/3" | "1/1";

export interface IImagePageComponent extends IBasePageComponent {
  componentType: "image";
  imageSlug?: string;
  caption?: string;
  alt?: string;
  aspectRatio: ImageAspectRatio;
}
