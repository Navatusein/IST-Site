import {IBasePageComponent} from "@/entities/dynamic-page";

export interface ITitlePageComponent extends IBasePageComponent {
  level: 1|2|3|4|5;
  title: string;
}

export const TitleComponentExample = {
  name: "Заголовок",
  component: {
    type: "title",
    width: "small",
    level: 3,
    title: "Заголовок"
  } as ITitlePageComponent
}