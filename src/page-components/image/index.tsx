import Image from "./ui/image/image";
import {IImagePageComponent, ImageAspectRatio} from "./types/type";
import {definePageComponent} from "@/entities/dynamic-page/model";
import dynamic from "next/dynamic";
import {Skeleton} from "antd";

const ImageEditor = dynamic(() => import("./ui/image-editor/image-editor"), {loading: () => <Skeleton active/>});

export type {IImagePageComponent, ImageAspectRatio};

export const imagePageComponent = definePageComponent<IImagePageComponent>({
  type: "image",
  name: "Фото",
  category: "universal",
  allowInRow: true,
  defaults: {
    width: "small",
    imageSlug: undefined,
    caption: undefined,
    aspectRatio: "original"
  },
  View: Image,
  Editor: ImageEditor
});
