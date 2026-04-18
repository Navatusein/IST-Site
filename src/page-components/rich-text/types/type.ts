import {IBasePageComponent} from "@/entities/dynamic-page";

export interface IRichTextPageComponent extends IBasePageComponent {
  text: string;
}

export const RichTextComponentExample = {
  name: "Текст",
  component: {
    type: "component",
    componentType: "rich-text",
    width: "small",
    text: "{\"type\":\"doc\",\"content\":[{\"type\":\"paragraph\",\"content\":[{\"type\":\"text\",\"text\":\"Текст\"}]}]}"
  } as IRichTextPageComponent
}