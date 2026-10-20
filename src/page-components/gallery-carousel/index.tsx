import GalleryCarousel from "./ui/gallery-carousel/gallery-carousel";
import {IGalleryCarouselPageComponent} from "./types/type";
import {definePageComponent} from "@/entities/dynamic-page/model";
import dynamic from "next/dynamic";
import {Skeleton} from "antd";

const GalleryCarouselEditor = dynamic(() => import("./ui/gallery-carousel-editor/gallery-carousel-editor"), {loading: () => <Skeleton active/>});

export type {IGalleryCarouselPageComponent};

export const galleryCarouselPageComponent = definePageComponent<IGalleryCarouselPageComponent>({
  type: "gallery-carousel",
  name: "Карусель",
  category: "universal",
  allowedWidth: ["large"],
  defaults: {
    width: "large",
    imageSlugs: []
  },
  View: GalleryCarousel,
  Editor: GalleryCarouselEditor
});
