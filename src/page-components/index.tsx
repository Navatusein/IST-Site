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
import {LinkButton, LinkButtonComponentExample} from "./link-button";
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
  "department-aspirant-list"|
  "link-button";

export interface IPageComponentGroupExamples {
  name: string;
  title: string;
  description: string;
  components: IPageComponentExample[];
}

export const componentTypes: ComponentDescriptorType = {
  "title": {
    "renderComponent": (props) => <Title component={props}/>,
    "renderEditor": (props, onChange) => <Title.Editor component={props} onChange={onChange}/>
  },
  "rich-text": {
    "renderComponent": (props) => <RichText component={props}/>,
    "renderEditor": (props, onChange) => <RichText.Editor component={props} onChange={onChange}/>
  },
  "gallery-carousel": {
    "renderComponent": (props) => <GalleryCarousel component={props}/>,
    "renderEditor": (props, onChange) => <GalleryCarousel.Editor component={props} onChange={onChange}/>
  },
  "cards": {
    "renderComponent": (props) => <Cards component={props}/>,
    "renderEditor": (props, onChange) => <Cards.Editor component={props} onChange={onChange}/>
  },
  "hero-section": {
    "renderComponent": (props) => <HeroSection component={props}/>,
    "renderEditor": (props, onChange) => <HeroSection.Editor component={props} onChange={onChange}/>
  },
  "hero-section-main": {
    "renderComponent": (props) => <HeroSectionMain component={props}/>,
    "renderEditor": (props, onChange) => <HeroSectionMain.Editor component={props} onChange={onChange}/>
  },
  "news-list": {
    "renderComponent": (props) => <NewsList component={props}/>,
    "renderEditor": (props, onChange) => <NewsList.Editor component={props} onChange={onChange}/>
  },
  "contact-us": {
    "renderComponent": (props) => <ContactUs component={props}/>,
    "renderEditor": (props, onChange) => <ContactUs.Editor component={props} onChange={onChange}/>
  },
  "department-staff-list": {
    "renderComponent": (props) => <DepartmentStaffList component={props}/>,
    "renderEditor": (props, onChange) => <DepartmentStaffList.Editor component={props} onChange={onChange}/>
  },
  "department-aspirant-list": {
    "renderComponent": (props) => <DepartmentAspirantList component={props}/>,
    "renderEditor": (props, onChange) => <DepartmentAspirantList.Editor component={props} onChange={onChange}/>
  },
   "link-button": {
    "renderComponent": (props) => <LinkButton component={props}/>,
    "renderEditor": (props, onChange) => <LinkButton.Editor component={props} onChange={onChange}/>
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
      LinkButtonComponentExample
    ]
  },
  {
    name: "specific-components",
    title: "Специфічні блоки",
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