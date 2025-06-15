import {IBasePageComponent} from "@/entities/dynamic-page";

export interface IHeroSectionPageComponent extends IBasePageComponent {
  title: string;
  imagePath: string;
  imageHeight: number;
  allowedWidth: ["large"];
}

export const HeroSectionComponentExample = {
  name: "Вітальний компонент",
  component: {
    type: "hero-section",
    title: "Назва",
    imagePath: "",
    imageHeight: 400,
    allowedWidth: ["large"],
    width: "large"
  } as IHeroSectionPageComponent
}