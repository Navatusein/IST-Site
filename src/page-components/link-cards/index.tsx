import LinkCards from "./ui/link-cards/link-cards";
import {ILinkCard, ILinkCardsPageComponent, LinkCardsData} from "./types/type";
import {getFileSlugs} from "./utilities/get-file-slugs";
import {getPageLinkFilesAction} from "@/features/page-link";
import {definePageComponent} from "@/entities/dynamic-page/model";
import dynamic from "next/dynamic";
import {Skeleton} from "antd";

const LinkCardsEditor = dynamic(() => import("./ui/link-cards-editor/link-cards-editor"), {loading: () => <Skeleton active/>});

export type {ILinkCard, ILinkCardsPageComponent, LinkCardsData};

export const linkCardsPageComponent = definePageComponent<ILinkCardsPageComponent, LinkCardsData>({
  type: "link-cards",
  name: "Картки з кнопками",
  category: "universal",
  defaults: {
    width: "medium",
    columns: 4,
    showNumbers: true,
    buttonText: "Детальніше",
    buttonVariant: "primary",
    cards: [
      {title: "Назва", description: "", linkType: "file", link: ""}
    ]
  },
  View: LinkCards,
  Editor: LinkCardsEditor,
  loadData: (component) => getPageLinkFilesAction(getFileSlugs(component))
});
