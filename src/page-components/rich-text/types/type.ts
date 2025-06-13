import {IBasePageComponent} from "@/entities/dynamic-page";

export interface IRichTextPageComponent extends IBasePageComponent {
  text: string;
}

export const RichTextComponentExample = {
  name: "Текст",
  component: {
    type: "rich-text",
    width: "medium",
    text: "{\"type\":\"doc\",\"content\":[{\"type\":\"paragraph\",\"content\":[{\"type\":\"text\",\"text\":\"Some text\"}]}]}"
  } as IRichTextPageComponent
}