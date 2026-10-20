import {Document} from "mongoose";

export type SocialNetwork = "facebook" | "instagram" | "youtube" | "telegram" | "linkedin" | "x" | "other";

export const SOCIAL_NETWORK_NAMES: Record<SocialNetwork, string> = {
  facebook: "Facebook",
  instagram: "Instagram",
  youtube: "YouTube",
  telegram: "Telegram",
  linkedin: "LinkedIn",
  x: "X (Twitter)",
  other: "Інший сайт",
};

export interface ISocialLink {
  network: SocialNetwork;
  url: string;
}

export interface ISiteContacts {
  address: string;
  addressLink: string;
  email: string;
  phone: string;
}

export interface ISiteSettingsData extends ISiteContacts {
  siteTitle: string;
  siteShortName: string;
  siteDescription: string;
  organizationName: string;
  workingHours: string;
  socialLinks: ISocialLink[];
  mapEmbedUrl: string;
  copyright: string;
}

export interface ISiteSettings extends ISiteSettingsData, Document {
  key: string;
}

export const SITE_SETTINGS_KEY = "main";

export const MAP_EMBED_URL_PREFIX = "https://www.google.com/maps/embed";

export const SITE_SETTINGS_DEFAULTS: ISiteSettingsData = {
  siteTitle: "Кафедра інформаційних систем та технологій КНУ імені Тараса Шевченка",
  siteShortName: "Кафедра ІСТ",
  siteDescription: "Інформація про кафедру інформаційних систем та технологій КНУ імені Тараса Шевченка, її співробітників та аспірантів, освітні програми підготовки бакалаврів, магістрів та докторів філософії зі спеціальності 126 - \"Інформаційні системи та технології\"",
  organizationName: "Кафедра інформаційних систем та технологій",
  workingHours: "Понеділок-п’ятниця: 8:00 – 18:00\nСубота & Неділя: Вихідний",
  address: "вул. Богдана Гаврилишина, 24, Київ, Україна",
  addressLink: "https://maps.app.goo.gl/wEdHhfHdVc15HExb9",
  email: "ist@fit.knu.ua",
  phone: "044 521 33 56",
  socialLinks: [
    {network: "facebook", url: "https://www.facebook.com/ist.knu.ua"},
    {network: "instagram", url: "https://www.instagram.com/ist.fit.knu/"},
  ],
  mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d755.211644622456!2d30.47420755218459!3d50.455645356251054!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40d4ce80bb14c36b%3A0x31d104253e38d4e0!2z0KTQsNC60YPQu9GM0YLQtdGCINGW0L3RhNC-0YDQvNCw0YbRltC50L3QuNGFINGC0LXRhdC90L7Qu9C-0LPRltC5INCa0LjRl9Cy0YHRjNC60L7Qs9C-INC90LDRhtGW0L7QvdCw0LvRjNC90L7Qs9C-INGD0L3RltCy0LXRgNGB0LjRgtC10YLRgyDRltC80LXQvdGWINCi0LDRgNCw0YHQsCDQqNC10LLRh9C10L3QutCw!5e0!3m2!1suk!2sua!4v1747509912322!5m2!1suk!2sua",
  copyright: "Department of Information Systems and Technology (TSNUK)",
};
