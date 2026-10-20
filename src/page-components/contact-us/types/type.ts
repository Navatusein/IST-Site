import {IBasePageComponent} from "@/entities/dynamic-page";

export interface IContactUsContacts {
  address?: string;
  addressLink?: string;
  email?: string;
  phone?: string;
}

export interface IContactUsPageComponent extends IBasePageComponent, IContactUsContacts {
  componentType: "contact-us";
  useSiteContacts?: boolean;
}

export interface IContactUsMessage {
  name: string;
  email: string;
  subject?: string;
  message: string;
  website?: string;
}

export const CONTACT_US_LIMITS = {
  name: 100,
  email: 200,
  subject: 200,
  messageMin: 10,
  message: 5000,
};
