import {IBasePageComponent} from "@/entities/dynamic-page";

export interface IPhotoGalleryPhoto {
  imageSlug?: string;
  caption?: string;
  alt?: string;
}

export interface IPhotoGalleryPageComponent extends IBasePageComponent {
  componentType: "photo-gallery";
  photos: IPhotoGalleryPhoto[];
  columns: 2 | 3 | 4;
}
