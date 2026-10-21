import {AnyPageComponentDescriptor, IPageComponentCategory, IPageComponentRegistry} from "@/entities/dynamic-page/model";
import {titlePageComponent} from "@/page-components/title";
import {richTextPageComponent} from "@/page-components/rich-text";
import {imagePageComponent} from "@/page-components/image";
import {photoGalleryPageComponent} from "@/page-components/photo-gallery";
import {galleryCarouselPageComponent} from "@/page-components/gallery-carousel";
import {documentPageComponent} from "@/page-components/document";
import {linkCardsPageComponent} from "@/page-components/link-cards";
import {heroSectionPageComponent} from "@/page-components/hero-section";
import {buttonsPageComponent} from "@/page-components/buttons";
import {heroSectionMainPageComponent} from "@/page-components/hero-section-main";
import {contactUsPageComponent} from "@/page-components/contact-us";
import {newsListPageComponent} from "@/page-components/news-list";
import {departmentStaffListPageComponent} from "@/page-components/department-staff-list";
import {departmentAspirantListPageComponent} from "@/page-components/department-aspirants-list";

const pageComponents: AnyPageComponentDescriptor[] = [
  titlePageComponent,
  richTextPageComponent,
  imagePageComponent,
  photoGalleryPageComponent,
  galleryCarouselPageComponent,
  documentPageComponent,
  linkCardsPageComponent,
  heroSectionPageComponent,
  buttonsPageComponent,
  heroSectionMainPageComponent,
  contactUsPageComponent,
  newsListPageComponent,
  departmentStaffListPageComponent,
  departmentAspirantListPageComponent,
];

const pageComponentCategories: IPageComponentCategory[] = [
  {
    name: "universal",
    title: "Універсальні блоки",
    description: "Блоки які підходять для будь-якої сторінки"
  },
  {
    name: "specific",
    title: "Специфічні блоки",
    description: "Блоки для конкретних сторінок"
  },
];

const pageComponentsByType = new Map(pageComponents.map((descriptor) => [descriptor.type, descriptor]));

export const pageComponentRegistry: IPageComponentRegistry = {
  components: pageComponents,
  categories: pageComponentCategories,
  getDescriptor: (componentType) => pageComponentsByType.get(componentType),
};
