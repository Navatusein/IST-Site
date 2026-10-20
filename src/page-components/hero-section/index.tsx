import HeroSection from "./ui/hero-section/hero-section";
import {IHeroSectionPageComponent} from "./types/type";
import {definePageComponent} from "@/entities/dynamic-page/model";
import dynamic from "next/dynamic";
import {Skeleton} from "antd";

const HeroSectionEditor = dynamic(() => import("./ui/hero-section-editor/hero-section-editor"), {loading: () => <Skeleton active/>});

export type {IHeroSectionPageComponent};

export const heroSectionPageComponent = definePageComponent<IHeroSectionPageComponent>({
  type: "hero-section",
  name: "Вітальний блок",
  category: "universal",
  allowedWidth: ["large"],
  defaults: {
    width: "large",
    title: "{\"type\":\"doc\",\"content\":[{\"type\":\"heading\",\"attrs\":{\"level\":1},\"content\":[{\"type\":\"text\",\"text\":\"Заголовок\"}]}]}",
    imageSlug: undefined,
    imageHeight: 400
  },
  View: HeroSection,
  Editor: HeroSectionEditor
});
