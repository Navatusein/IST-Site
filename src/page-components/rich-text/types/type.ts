import {IBasePageComponent} from "@/entities/dynamic-page";

export interface IRichTextPageComponent extends IBasePageComponent {
  componentType: "rich-text";
  text: string;
}
