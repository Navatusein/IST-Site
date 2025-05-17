import {IBasePageComponent} from "@/entities/dynamic-page";

export interface IMarkdownTextPageComponent extends IBasePageComponent {
  text: string;
}

export const MarkdownTextComponentExample = {
  name: "Текст",
  component: {
    type: "markdown-text",
    width: "medium",
    text: "Some text"
  } as IMarkdownTextPageComponent
}