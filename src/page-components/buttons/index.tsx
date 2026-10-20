import Buttons from "./ui/buttons/buttons";
import {ButtonsData, IButtonsItem, IButtonsPageComponent} from "./types/type";
import {getPageLinkFilesAction} from "@/features/page-link";
import {getFileSlugs} from "./utilities/get-file-slugs";
import {definePageComponent} from "@/entities/dynamic-page/model";
import dynamic from "next/dynamic";
import {Skeleton} from "antd";

const ButtonsEditor = dynamic(() => import("./ui/buttons-editor/buttons-editor"), {loading: () => <Skeleton active/>});

export type {ButtonsData, IButtonsItem, IButtonsPageComponent};

export const buttonsPageComponent = definePageComponent<IButtonsPageComponent, ButtonsData>({
  type: "buttons",
  name: "Кнопки",
  category: "universal",
  allowInRow: true,
  defaults: {
    width: "small",
    buttons: [{title: "Кнопка", linkType: "link", link: ""}],
    layout: "row",
    fullWidth: false,
    align: "start",
    variant: "primary"
  },
  View: Buttons,
  Editor: ButtonsEditor,
  loadData: (component) => getPageLinkFilesAction(getFileSlugs(component))
});
