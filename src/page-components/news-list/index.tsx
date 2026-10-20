import NewsList from "./ui/news-list/news-list";
import {INewsListData, INewsListPageComponent} from "./types/type";
import {definePageComponent} from "@/entities/dynamic-page/model";
import {getNewsListDataAction} from "./actions/actions";
import dynamic from "next/dynamic";
import {Skeleton} from "antd";

const NewsListEditor = dynamic(() => import("./ui/news-list-editor/news-list-editor"), {loading: () => <Skeleton active/>});

export type {INewsListPageComponent, INewsListData};

export const newsListPageComponent = definePageComponent<INewsListPageComponent, INewsListData>({
  type: "news-list",
  name: "Список новин",
  category: "specific",
  defaults: {
    width: "small",
    countDisplayed: 5,
    pagination: false
  },
  View: NewsList,
  Editor: NewsListEditor,
  loadData: (component) => getNewsListDataAction(component.countDisplayed, 1)
});
