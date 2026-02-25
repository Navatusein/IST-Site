import {IBasePageComponent} from "@/entities/dynamic-page";

export interface IHeroSectionMainFastLink {
  path: string;
  title: string;
}

export interface IHeroSectionMainStatistics {
  title: string;
  icon: string;
  value: number;
}

export interface IHeroSectionMainPageComponent extends IBasePageComponent {
  department: string;
  faculty: string;
  university: string;
  text: string;
  imagePath: string;
  imageHeight: number;
  fastLinks: IHeroSectionMainFastLink[];
  statistics: IHeroSectionMainStatistics[];
  allowedWidth: ["large"];
}

export const HeroSectionMainComponentExample = {
  name: "Вітальний блок домашньої сторінки",
  component: {
    type: "hero-section-main",
    width: "large",
    allowedWidth: ["large"],
    faculty: "Факультету інформаційних технологій",
    department: "КАФЕДРА ІНФОРМАЦІЙНИХ СИСТЕМ ТА ТЕХНОЛОГІЙ",
    university: "Київського національного університету імені Тараса Шевченка",
    text:"{}",
    imagePath: "/missing-image.webp",
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
  } as IHeroSectionMainPageComponent
}