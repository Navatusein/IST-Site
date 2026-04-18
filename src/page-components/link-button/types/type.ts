import {IBasePageComponent} from "@/entities/dynamic-page";

export type LinkButtonTypes = "link"|"file"|"page";

export interface ILinkButtonPageComponent extends IBasePageComponent {
  title: string;
  linkType: LinkButtonTypes;
  link: string;
}

export const LinkButtonComponentExample = {
  name: "Кнопка посилання",
  component: {
    type: "component",
    componentType: "link-button",
    title: "Гугл",
    linkType: "link",
    link: "https://www.google.com/",
  } as ILinkButtonPageComponent
}