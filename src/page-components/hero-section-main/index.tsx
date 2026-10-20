import HeroSectionMain from "./ui/hero-section-main/hero-section-main";
import {IHeroSectionMainFastLink, IHeroSectionMainPageComponent, IHeroSectionMainStatistics} from "./types/type";
import {definePageComponent} from "@/entities/dynamic-page/model";
import dynamic from "next/dynamic";
import {Skeleton} from "antd";

const HeroSectionMainEditor = dynamic(() => import("./ui/hero-section-main-editor/hero-section-main-editor"), {loading: () => <Skeleton active/>});

export type {IHeroSectionMainPageComponent, IHeroSectionMainFastLink, IHeroSectionMainStatistics};

export const heroSectionMainPageComponent = definePageComponent<IHeroSectionMainPageComponent>({
  type: "hero-section-main",
  name: "Вітальний блок домашньої сторінки",
  category: "specific",
  allowedWidth: ["large"],
  defaults: {
    width: "large",
    faculty: "Факультету інформаційних технологій",
    department: "КАФЕДРА ІНФОРМАЦІЙНИХ СИСТЕМ ТА ТЕХНОЛОГІЙ",
    university: "Київського національного університету імені Тараса Шевченка",
    text: "{}",
    imageSlug: undefined,
    imageHeight: 600,
    fastLinks: [
      {path: "#", title: "ПРО КАФЕДРУ"},
      {path: "#", title: "СТУДЕНТАМ"},
      {path: "#", title: "ВСТУПНИКАМ"},
    ],
    statistics: [
      {title: "Освітніх програм", value: 4},
      {title: "Здобувачів освітніх ступенів", value: 150},
      {title: "Сертифікованих викладачів", icon: "UserOutlined", value: 11},
      {title: "Партнерів та IT-компаній", icon: "SolutionOutlined", value: 21},
    ]
  },
  View: HeroSectionMain,
  Editor: HeroSectionMainEditor
});
