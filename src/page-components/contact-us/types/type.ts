import {IBasePageComponent} from "@/entities/dynamic-page";

export interface IContactUsPageComponent extends IBasePageComponent {

}

export const ContactUsComponentExample = {
  name: "Зворотній звязок",
  component: {
    type: "contact-us",
  } as IContactUsPageComponent
}