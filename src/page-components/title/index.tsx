import Title from "./ui/title/title";
import {ITitlePageComponent} from "./types/type";
import {definePageComponent} from "@/entities/dynamic-page/model";
import dynamic from "next/dynamic";
import {Skeleton} from "antd";

const TitleEditor = dynamic(() => import("./ui/title-editor/title-editor"), {loading: () => <Skeleton active/>});

export type {ITitlePageComponent};

export const titlePageComponent = definePageComponent<ITitlePageComponent>({
  type: "title",
  name: "Заголовок",
  category: "universal",
  allowInRow: true,
  defaults: {
    width: "small",
    level: 3,
    title: "Заголовок"
  },
  View: Title,
  Editor: TitleEditor
});
