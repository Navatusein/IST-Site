import {IBasePageComponent} from "@/entities/dynamic-page";
import type {IPageLink, PageLinkFiles} from "@/features/page-link";

export interface IButtonsItem extends IPageLink {
  title: string;
}

export interface IButtonsPageComponent extends IBasePageComponent {
  componentType: "buttons";
  buttons: IButtonsItem[];
  layout: "row" | "column";
  fullWidth: boolean;
  align: "start" | "center" | "end";
  variant: "primary" | "default";
}

export type ButtonsData = PageLinkFiles;
