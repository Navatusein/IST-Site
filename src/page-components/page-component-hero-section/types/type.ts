import {IBasePageComponent} from "@/entities/dynamic-page";

export interface IHeroSectionFastLink {
  path: string;
  title: string;
}

export interface IHeroSectionStatistics {
  title: string;
  icon: string;
  value: number;
}

export interface IHeroSectionPageComponent extends IBasePageComponent {
  title: string;
  text: string;
  imagePath: string;
  imageHeight: number;
  fastLinks: IHeroSectionFastLink[];
  statistics: IHeroSectionStatistics[];
}

export const HeroSectionComponentExample = {
  name: "Вітальна секція",
  component: {
    type: "hero-section",
    title: "Кафедра інформаційних систем  та технологій",
    text: "Підготовка фахівців в F6 - \"Інформаційні системи та технології\" за освітніми програмами бакалавра, магістра і PhD",
    imagePath: "red-corps.webp",
    imageHeight: 600,
    fastLinks: [
      {path: "#", title: "ПРО КАФЕДРУ"},
      {path: "#", title: "СТУДЕНТАМ"},
      {path: "#", title: "ВСТУПНИКАМ"},
    ],
    statistics: [
      {title: "Освітніх програм", icon: "BookOutlined", value: 4},
      {title: "Здобувачів освітніх ступенів", icon: "TeamOutlined", value: 150},
      {title: "Сертифікованих викладачів", icon: "UserOutlined", value: 11},
      {title: "Партнерів та IT-компаній", icon: "SolutionOutlined", value: 21},
    ]
  } as IHeroSectionPageComponent
};