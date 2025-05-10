import {IBasePageComponent} from "@/entities/dynamic-page";

export interface ITextPageComponent extends IBasePageComponent {
  content: string;
};

export const TextComponentExample = {
  name: "Текст",
  component: {
    type: "text",
    content: "Hi i am page-component-text component"
  } as ITextPageComponent
};