import {IBasePageComponent} from "@/entities/dynamic-page";

export interface IRichTextPageComponent extends IBasePageComponent {
  text: string;
}

export const RichTextComponentExample = {
  name: "Текст",
  component: {
    type: "markdown-text",
    width: "medium",
    text: "Some text"
  } as IRichTextPageComponent
}