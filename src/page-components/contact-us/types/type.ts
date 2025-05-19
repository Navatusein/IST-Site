import {IBasePageComponent} from "@/entities/dynamic-page";

export interface IContactUsPageComponent extends IBasePageComponent {

}

export const ContactUsComponentExample = {
  name: "",
  component: {
    type: "contact-us",

  } as IContactUsPageComponent
}