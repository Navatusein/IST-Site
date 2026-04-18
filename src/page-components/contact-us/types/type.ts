import {IBasePageComponent} from "@/entities/dynamic-page";

export interface IContactUsPageComponent extends IBasePageComponent {

}

export const ContactUsComponentExample = {
  name: "Зворотній зв'язок",
  component: {
    type: "component",
    componentType: "contact-us",
    width: "small"
  } as IContactUsPageComponent
}