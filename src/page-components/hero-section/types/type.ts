import {IBasePageComponent} from "@/entities/dynamic-page";

export interface IHeroSectionPageComponent extends IBasePageComponent {
  title: string;
  imagePath?: string;
  imageHeight: number;
  allowedWidth: ["large"];
}

export const HeroSectionComponentExample = {
  name: "Вітальний компонент",
  component: {
    type: "hero-section",
    title: "{\"type\":\"doc\",\"content\":[{\"type\":\"heading\",\"attrs\":{\"level\":1},\"content\":[{\"type\":\"text\",\"text\":\"Заголовок\"}]}]}",
    imagePath: undefined,
    imageHeight: 400,
    allowedWidth: ["large"],
    width: "large"
  } as IHeroSectionPageComponent
}