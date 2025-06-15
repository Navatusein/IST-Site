import {IBasePageComponent} from "@/entities/dynamic-page";

export interface INewsListPageComponent extends IBasePageComponent {
  countDisplayed: number;
  pagination: boolean;
}

export const NewsListComponentExample = {
  name: "Список новин",
  component: {
    type: "news-list",
    width: "small",
    countDisplayed: 5,
    pagination: false
  } as INewsListPageComponent
}