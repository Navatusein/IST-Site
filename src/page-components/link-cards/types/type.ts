import {IBasePageComponent} from "@/entities/dynamic-page";
import type {IPageLink, PageLinkFiles} from "@/features/page-link";

export interface ILinkCard extends IPageLink {
  title: string;
  description?: string;
  buttonText?: string;
}

export interface ILinkCardsPageComponent extends IBasePageComponent {
  componentType: "link-cards";
  cards: ILinkCard[];
  columns: 2 | 3 | 4;
  showNumbers: boolean;
  buttonText: string;
  buttonVariant: "primary" | "default";
}

export type LinkCardsData = PageLinkFiles;
