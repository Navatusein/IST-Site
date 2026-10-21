"use server"

import {INews, NewsModel} from "@/entities/news";
import toPlainObject from "@/shared/utilities/to-plain-object";
import {createServerAction} from "@/shared/utilities/create-server-action";
import {cachePublicData} from "@/shared/utilities/cache-public-data";
import {clampInteger} from "@/shared/utilities/public-input";
import {INewsListData} from "../types/type";
import {getNewsCountDisplayed} from "../utilities/news-count";

const loadNewsListData = cachePublicData("getNewsListDataAction", async (countDisplayed: number, page: number) => {
  const [news, total] = await Promise.all([
    NewsModel
      .find<INews>({})
      .sort({date: "desc", createdAt: "desc"})
      .skip((page - 1) * countDisplayed)
      .limit(countDisplayed),
    NewsModel.countDocuments()
  ]);

  return toPlainObject<INewsListData>({news, total});
});

export const getNewsListDataAction = createServerAction<INewsListData>(async (countDisplayed: unknown, page: unknown) => (
  loadNewsListData(getNewsCountDisplayed(countDisplayed), clampInteger(page, 1, 1000, 1))
));
