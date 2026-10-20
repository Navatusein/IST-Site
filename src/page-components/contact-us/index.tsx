import ContactUs from "./ui/contact-us/contact-us";
import {IContactUsPageComponent} from "./types/type";
import {definePageComponent} from "@/entities/dynamic-page/model";
import type {ISiteContacts} from "@/entities/site-settings";
import {getSiteSettingsAction} from "@/entities/site-settings/actions/actions";
import dynamic from "next/dynamic";
import {Skeleton} from "antd";

const ContactUsEditor = dynamic(() => import("./ui/contact-us-editor/contact-us-editor"), {loading: () => <Skeleton active/>});

export type {IContactUsPageComponent};

export const contactUsPageComponent = definePageComponent<IContactUsPageComponent, ISiteContacts>({
  type: "contact-us",
  name: "Зворотній зв'язок",
  category: "specific",
  defaults: {
    width: "small",
    useSiteContacts: true
  },
  View: ContactUs,
  Editor: ContactUsEditor,
  loadData: () => getSiteSettingsAction()
});
