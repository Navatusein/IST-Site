import PhotoGallery from "./ui/photo-gallery/photo-gallery";
import {IPhotoGalleryPageComponent, IPhotoGalleryPhoto} from "./types/type";
import {definePageComponent} from "@/entities/dynamic-page/model";
import dynamic from "next/dynamic";
import {Skeleton} from "antd";

const PhotoGalleryEditor = dynamic(() => import("./ui/photo-gallery-editor/photo-gallery-editor"), {loading: () => <Skeleton active/>});

export type {IPhotoGalleryPageComponent, IPhotoGalleryPhoto};

export const photoGalleryPageComponent = definePageComponent<IPhotoGalleryPageComponent>({
  type: "photo-gallery",
  name: "Фотогалерея",
  category: "universal",
  allowInRow: true,
  defaults: {
    width: "medium",
    columns: 3,
    photos: []
  },
  View: PhotoGallery,
  Editor: PhotoGalleryEditor
});
