import {IBasePageComponent} from "@/entities/dynamic-page";
import {INews} from "@/entities/news";

export interface INewsListPageComponent extends IBasePageComponent {
  componentType: "news-list";
  countDisplayed: number;
  pagination: boolean;
}

export interface INewsListData {
  news: INews[];
  total: number;
}
