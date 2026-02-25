import {ComponentDescriptorType} from "@/widgets/page-component-renderer/types/type";
import {IPageComponentExample} from "@/entities/dynamic-page";
import {NewsList, NewsListComponentExample} from "./news-list";
import {HeroSectionMain, HeroSectionMainComponentExample} from "./hero-section-main";
import {RichText, RichTextComponentExample} from "./rich-text";
import {Title, TitleComponentExample} from "./title";
import {ContactUs, ContactUsComponentExample} from "./contact-us";
import {GalleryCarousel, GalleryCarouselComponentExample} from "./gallery-carousel";
import {HeroSection, HeroSectionComponentExample} from "./hero-section";
import {DepartmentStaffList, DepartmentStaffListComponentExample} from "./department-staff-list";
import {DepartmentAspirantList, DepartmentAspirantListComponentExample} from "./department-aspirants-list";
import {Cards, CardsComponentExample} from "./cards"

export type PageComponentType = "title"|
  "rich-text"|
  "gallery-carousel"|
  "cards"|
  "hero-section"|
  "hero-section-main"|
  "news-list"|
  "contact-us"|
  "department-staff-list"|
  "department-aspirant-list";

export interface IPageComponentGroupExamples {
  name: string;
  title: string;
  description: string;
  components: IPageComponentExample[];
}

export const componentTypes: ComponentDescriptorType = {
  "title": {
    "renderComponent": (props) => <Title componentProps={props}/>,
    "renderEditor": (props, onChange) => <Title.Editor componentProps={props} onChange={onChange}/>
  },
  "rich-text": {
    "renderComponent": (props) => <RichText componentProps={props}/>,
    "renderEditor": (props, onChange) => <RichText.Editor componentProps={props} onChange={onChange}/>
  },
  "gallery-carousel": {
    "renderComponent": (props) => <GalleryCarousel componentProps={props}/>,
    "renderEditor": (props, onChange) => <GalleryCarousel.Editor componentProps={props} onChange={onChange}/>
  },
  "cards": {
    "renderComponent": (props) => <Cards componentProps={props}/>,
    "renderEditor": (props, onChange) => <Cards.Editor componentProps={props} onChange={onChange}/>
  },
  "hero-section": {
    "renderComponent": (props) => <HeroSection componentProps={props}/>,
    "renderEditor": (props, onChange) => <HeroSection.Editor componentProps={props} onChange={onChange}/>
  },
  "hero-section-main": {
    "renderComponent": (props) => <HeroSectionMain componentProps={props}/>,
    "renderEditor": (props, onChange) => <HeroSectionMain.Editor componentProps={props} onChange={onChange}/>
  },
  "news-list": {
    "renderComponent": (props) => <NewsList componentProps={props}/>,
    "renderEditor": (props, onChange) => <NewsList.Editor componentProps={props} onChange={onChange}/>
  },
  "contact-us": {
    "renderComponent": (props) => <ContactUs componentProps={props}/>,
    "renderEditor": (props, onChange) => <ContactUs.Editor componentProps={props} onChange={onChange}/>
  },
  "department-staff-list": {
    "renderComponent": (props) => <DepartmentStaffList componentProps={props}/>,
    "renderEditor": (props, onChange) => <DepartmentStaffList.Editor componentProps={props} onChange={onChange}/>
  },
  "department-aspirant-list": {
    "renderComponent": (props) => <DepartmentAspirantList componentProps={props}/>,
    "renderEditor": (props, onChange) => <DepartmentAspirantList.Editor componentProps={props} onChange={onChange}/>
  },
}

export const pageComponentGroupExamples: IPageComponentGroupExamples[] = [
  {
    name: "universal-components",
    title: "Універсальні блоки",
    description: "Блоки які підходять для будь-якої сторінки",
    components: [
      TitleComponentExample,
      RichTextComponentExample,
      GalleryCarouselComponentExample,
      CardsComponentExample,
      HeroSectionComponentExample,
    ]
  },
  {
    name: "specific-components",
    title: "Спецефічні блоки",
    description: "Блоки для конкретних сторінок",
    components: [
      HeroSectionMainComponentExample,
      ContactUsComponentExample,
      NewsListComponentExample,
      DepartmentStaffListComponentExample,
      DepartmentAspirantListComponentExample,
    ]
  },
]